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
  PriceChangeEventTypeItem,
  SubscriptionData,
  useNotifiSubscribe,
} from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  priceChangeConfiguration,
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';

export type EventTypePriceChangeRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: PriceChangeEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypePriceChangeRow: React.FC<
  EventTypePriceChangeRowProps
> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypePriceChangeRowProps) => {
  const { alerts, loading, render } = useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const { isUsingFrontendClient, frontendClient } = useNotifiClientContext();

  const [enabled, setEnabled] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const alertName = useMemo<string>(() => config.name, [config]);
  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    return priceChangeConfiguration({
      tokenIds: config.tokenIds,
    });
  }, [alertName, config]);
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

  const subscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs: Record<string, unknown>;
      }>,
    ): Promise<SubscriptionData> => {
      if (isUsingFrontendClient) {
        return subscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertConfiguration: alertConfiguration,
          alertName: alertName,
        });
      }
    },
    [isUsingFrontendClient, frontendClient, config],
  );
  const unSubscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs: Record<string, unknown>;
      }>,
    ) => {
      if (isUsingFrontendClient) {
        return unsubscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertName: alertDetail.eventType.name,
          alertConfiguration: null,
        });
      }
    },
    [isUsingFrontendClient, frontendClient],
  );

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
          isUsingFrontendClient && frontendClient.fetchData().then(render);
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
          isUsingFrontendClient && frontendClient.fetchData().then(render);
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
        'EventTypePriceChangeRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx('EventTypePriceChangeRow__label', classNames?.label)}
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
