import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const [enabled, setEnabled] = useState(false);

  const alertName = useMemo<string>(() => config.name, [config]);

  const tooltipContent = config.tooltipContent;

  useEffect(() => {
    if (loading) {
      return;
    }

    const hasAlert = alerts[alertName] !== undefined;
    setEnabled(hasAlert);
  }, [alertName, alerts, loading]);

  const handleNewSubscription = useCallback(() => {
    if (loading) {
      return;
    }

    if (!enabled) {
      instantSubscribe({
        alertConfiguration: walletBalanceConfiguration({
          connectedWallets,
        }),
        alertName: alertName,
      });
    } else {
      instantSubscribe({
        alertConfiguration: null,
        alertName: alertName,
      });
    }
  }, [enabled, instantSubscribe, alertName]);

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
        disabled={disabled}
        checked={enabled}
        setChecked={handleNewSubscription}
      />
    </div>
  );
};
