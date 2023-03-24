import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { WalletBalanceEventTypeItem, useNotifiSubscribe } from '../../hooks';
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
> = ({ classNames, disabled, config }: EventTypeWalletBalanceRowProps) => {
  const { alerts, loading, connectedWallets } = useNotifiSubscriptionContext();
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
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

  const handleNewSubscription = useCallback(() => {
    if (loading || isNotificationLoading) {
      return;
    }

    if (!enabled) {
      setEnabled(true);

      instantSubscribe({
        alertConfiguration: walletBalanceConfiguration({
          connectedWallets,
        }),
        alertName: alertName,
      });
    } else {
      setEnabled(false);
      instantSubscribe({
        alertConfiguration: null,
        alertName: alertName,
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
