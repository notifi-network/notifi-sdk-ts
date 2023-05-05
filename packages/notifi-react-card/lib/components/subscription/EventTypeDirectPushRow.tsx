import { EventTypeItem } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import {
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from 'notifi-react-card/lib/utils/frontendClient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import {
  DirectPushEventTypeItem,
  SubscriptionData,
  useNotifiSubscribe,
} from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  directMessageConfiguration,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

export type EventTypeDirectPushRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: DirectPushEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeDirectPushRow: React.FC<EventTypeDirectPushRowProps> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypeDirectPushRowProps) => {
  const { alerts, loading, setLoading } = useNotifiSubscriptionContext();

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const {
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();
  const [enabled, setEnabled] = useState(false);

  const pushId = useMemo(
    () => resolveStringRef(config.name, config.directPushId, inputs),
    [config, inputs],
  );
  const alertName = useMemo<string>(() => {
    if (config.directPushId.type === 'value') {
      return config.name;
    }

    return `${config.name}:${pushId}`;
  }, [config, pushId]);
  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    return directMessageConfiguration({
      type: pushId,
    });
  }, [alertName, config, inputs]);
  const tooltipContent = config.tooltipContent;

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

  useEffect(() => {
    if (loading) {
      return;
    }
    const hasAlert = alerts[alertName] !== undefined;
    setEnabled(hasAlert);
  }, [alertName, alerts]);

  const handleNewSubscription = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (!enabled) {
      subscribeAlert({
        eventType: config,
        inputs,
      })
        .then(() => setEnabled(true))
        .catch(() => {
          setEnabled(false);
          // TODO: Implement Rerender (blocked by MVP-2585)
        })
        .finally(() => setLoading(false));
    } else {
      unSubscribeAlert({
        eventType: config,
        inputs,
      })
        .then(() => setEnabled(false))
        .catch(() => {
          setEnabled(true);
          // TODO: Implement Rerender (blocked by MVP-2585)
        })
        .finally(() => setLoading(false));
    }
  }, [enabled, instantSubscribe, alertConfiguration, alertName]);

  return (
    <div
      className={clsx(
        'EventTypeDirectPushRow__container',
        classNames?.container,
      )}
    >
      <div className={clsx('EventTypeDirectPushRow__label', classNames?.label)}>
        {config.name}
        {tooltipContent !== undefined && tooltipContent.length > 0 ? (
          <NotifiTooltip
            classNames={classNames?.tooltip}
            content={tooltipContent}
          />
        ) : null}
      </div>
      <NotifiToggle
        classNames={classNames?.toggle}
        disabled={disabled}
        checked={enabled}
        setChecked={handleNewSubscription}
      />
    </div>
  );
};
