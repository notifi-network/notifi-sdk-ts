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
  EventTypeItem,
  SubscriptionData,
  WalletBalanceEventTypeItem,
  useNotifiSubscribe,
} from '../../hooks';
import { DeepPartialReadonly, walletBalanceConfiguration } from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';

export type EventTypeWalletBalanceRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: WalletBalanceEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeWalletBalanceRow: React.FC<
  EventTypeWalletBalanceRowProps
> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypeWalletBalanceRowProps) => {
  const { alerts, loading, connectedWallets, render, setLoading } =
    useNotifiSubscriptionContext();
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const {
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();

  const [enabled, setEnabled] = useState(false);

  const alertName = useMemo<string>(() => config.name, [config]);

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
      if (isCanaryActive) {
        return subscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertConfiguration: walletBalanceConfiguration({ connectedWallets }),
          alertName: alertName,
        });
      }
    },
    [isCanaryActive, frontendClient, config],
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
    [isCanaryActive, frontendClient],
  );

  const handleNewSubscription = useCallback(() => {
    if (loading || isNotificationLoading) {
      return;
    }
    setLoading(true);

    if (!enabled) {
      subscribeAlert({
        eventType: config,
        inputs,
      })
        .then(() => {
          isCanaryActive && frontendClient.fetchData().then(render);
          setEnabled(true);
        })
        .catch(() => {
          setEnabled(false);
        })
        .finally(() => setLoading(false));
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

            if (responseHasAlert !== true) {
              setEnabled(false);
            }
          }
          // Else, ensured by frontendClient
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch(() => {
          setEnabled(true);
        })
        .finally(() => {
          setIsNotificationLoading(false);
          setLoading(false);
        });
    }
  }, [
    enabled,
    instantSubscribe,
    alertName,
    setIsNotificationLoading,
    isNotificationLoading,
    setEnabled,
  ]);

  return (
    <div
      className={clsx(
        'EventTypeWalletBalanceRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx('EventTypeWalletBalanceRow__label', classNames?.label)}
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
        classNames={classNames?.toggle}
        disabled={disabled || isNotificationLoading}
        checked={enabled}
        setChecked={handleNewSubscription}
      />
    </div>
  );
};
