import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { PriceChangeEventTypeItem, useNotifiSubscribe } from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  priceChangeConfiguration,
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
> = ({ classNames, disabled, config }: EventTypePriceChangeRowProps) => {
  const { alerts, loading, demoPreview } = useNotifiSubscriptionContext();
  const subscribe = demoPreview
    ? null
    : useNotifiSubscribe({
        targetGroupName: 'Default',
      });
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

  const handleNewSubscription = useCallback(() => {
    if (loading || isNotificationLoading || !subscribe) {
      return;
    }
    setIsNotificationLoading(true);

    if (!enabled) {
      setEnabled(true);
      subscribe
        .instantSubscribe({
          alertConfiguration: alertConfiguration,
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
    } else {
      setEnabled(false);
      subscribe
        .instantSubscribe({
          alertConfiguration: null,
          alertName: alertName,
        })
        .then((res) => {
          // We update optimistically so we need to check if the alert exists.
          const responseHasAlert = res.alerts[alertName] !== undefined;
          if (responseHasAlert !== false) {
            setEnabled(true);
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
    loading,
    enabled,
    subscribe?.instantSubscribe,
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
