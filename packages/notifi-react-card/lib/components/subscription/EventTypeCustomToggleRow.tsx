import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CustomTopicTypeItem, useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly, customToggleConfiguration } from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

export type EventTypeCustomToggleRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: CustomTopicTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeCustomToggleRow: React.FC<
  EventTypeCustomToggleRowProps
> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypeCustomToggleRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const [enabled, setEnabled] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const alertName = useMemo<string>(() => config.name, [config]);

  if (config.selectedUIType !== 'TOGGLE') {
    return null;
  }

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
      setIsNotificationLoading(true);

      instantSubscribe({
        alertConfiguration: customToggleConfiguration({
          sourceType: config.sourceType,
          filterType: config.filterType,
          filterOptions: config.filterOptions,
          sourceAddress: resolveStringRef(
            alertName,
            config.sourceAddress,
            inputs,
          ),
        }),
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

      instantSubscribe({
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
          setEnabled(true);
        })
        .finally(() => {
          setIsNotificationLoading(false);
        });
    }
  }, [
    enabled,
    alerts,
    instantSubscribe,
    alertName,
    isNotificationLoading,
    setEnabled,
    setIsNotificationLoading,
  ]);

  return (
    <div
      className={clsx(
        'EventTypeCustomToggleRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx('EventTypeCustomToggleRow__label', classNames?.label)}
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
