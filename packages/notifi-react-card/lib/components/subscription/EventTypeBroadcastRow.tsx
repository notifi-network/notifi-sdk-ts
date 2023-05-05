import { EventTypeItem } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import {
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from 'notifi-react-card/lib/utils/frontendClient';
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
  BroadcastEventTypeItem,
  SubscriptionData,
  useNotifiSubscribe,
} from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  broadcastMessageConfiguration,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

export type EventTypeBroadcastRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: BroadcastEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeBroadcastRow: React.FC<EventTypeBroadcastRowProps> = ({
  classNames,
  config,
  disabled,
  inputs,
}: EventTypeBroadcastRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const {
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();

  const [enabled, setEnabled] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const broadcastId = useMemo(
    () => resolveStringRef(config.name, config.broadcastId, inputs),
    [config, inputs],
  );

  const alertName = useMemo<string>(() => {
    if (config.broadcastId.type === 'value') {
      return config.name;
    }
    return `${config.name}:${broadcastId}`;
  }, [config, broadcastId]);

  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    return broadcastMessageConfiguration({
      topicName: broadcastId,
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
        'EventTypeBroadcastRow__container',
        classNames?.container,
      )}
    >
      <div className={clsx('EventTypeBroadcastRow__label', classNames?.label)}>
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
