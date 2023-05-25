import { EventTypeItem } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import {
  FusionToggleEventTypeItem,
  SubscriptionData,
  useNotifiSubscribe,
} from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  fusionToggleConfiguration,
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

export type EventTypeFusionRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: FusionToggleEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeFusionToggleRow: React.FC<EventTypeFusionRowProps> = ({
  classNames,
  config,
  disabled,
  inputs,
}: EventTypeFusionRowProps) => {
  const { alerts, loading, render } = useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const {
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();

  const [enabled, setEnabled] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const fusionEventId = useMemo(
    () => resolveStringRef(config.name, config.fusionEventId, inputs),
    [config, inputs],
  );

  const fusionSourceAddress = useMemo(
    () => resolveStringRef(config.name, config.sourceAddress, inputs),
    [config, inputs],
  );

  const alertName = useMemo<string>(() => {
    if (config.fusionEventId.type === 'value') {
      return config.name;
    }
    return `${config.name}:${fusionEventId}`;
  }, [config, fusionEventId]);

  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    return fusionToggleConfiguration({
      maintainSourceGroup: config?.maintainSourceGroup,
      fusionId: fusionEventId,
      fusionSourceAddress,
    });
  }, [alertName, config, inputs]);

  const subscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs: Record<string, unknown>;
      }>,
    ): Promise<SubscriptionData> => {
      if (isCanaryActive) {
        return subscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertName: alertDetail.eventType.name,
          alertConfiguration: alertConfiguration,
        });
      }
    },
    [isCanaryActive, frontendClient, alertConfiguration],
  );

  const unSubscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs: Record<string, unknown>;
      }>,
    ) => {
      if (isCanaryActive) {
        return unsubscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertName: alertDetail.eventType.name,
          alertConfiguration: null,
        });
      }
    },
    [isCanaryActive, frontendClient, alertConfiguration],
  );

  const tooltipContent = config.tooltipContent;

  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) {
      return;
    }

    const hasAlert = alerts[alertName] !== undefined;
    setEnabled(hasAlert);
    didFetch.current = true;
  }, [alertName, alerts]);

  const handleNewSubscription = useCallback(() => {
    if (loading || isNotificationLoading) {
      return;
    }
    setIsNotificationLoading(true);

    if (!enabled) {
      setEnabled(true);
      subscribeAlert({
        eventType: config,
        inputs,
      })
        .then((res) => {
          // We update optimistically so we need to check if the alert exists.
          const responseHasAlert = res.alerts[alertName] !== undefined;
          if (responseHasAlert !== true) {
            setEnabled(false);
          }
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch(() => {
          setEnabled(false);
        })
        .finally(() => {
          setIsNotificationLoading(false);
        });
    } else {
      setEnabled(false);
      unSubscribeAlert({
        eventType: config,
        inputs,
      })
        .then((res) => {
          // We update optimistically so we need to check if the alert exists.
          if (res) {
            const responseHasAlert = res.alerts[alertName] !== undefined;
            if (responseHasAlert !== false) {
              setEnabled(true);
            }
          }
          // Else, ensured by frontendClient
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch(() => {
          setEnabled(false);
        })
        .finally(() => {
          setIsNotificationLoading(false);
        });
    }
  }, [
    loading,
    enabled,
    instantSubscribe,
    alertConfiguration,
    alertName,
    isNotificationLoading,
    setIsNotificationLoading,
  ]);

  return (
    <div
      className={clsx(
        'EventTypeFusionToggleRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx('EventTypeFusionToggleRow__label', classNames?.label)}
      >
        {config.name}
        {tooltipContent !== undefined && tooltipContent.length > 0 ? (
          <NotifiTooltip
            classNames={classNames?.tooltip}
            content={tooltipContent}
          />
        ) : null}
      </div>
      <NotifiToggle
        checked={enabled}
        classNames={classNames?.toggle}
        disabled={disabled || isNotificationLoading}
        setChecked={handleNewSubscription}
      />
    </div>
  );
};
