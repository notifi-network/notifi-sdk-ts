import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { BroadcastEventTypeItem, useNotifiSubscribe } from '../../hooks';
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
  const [enabled, setEnabled] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const alertName = useMemo<string>(() => config.name, [config]);
  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    const broadcastId = resolveStringRef(alertName, config.broadcastId, inputs);
    return broadcastMessageConfiguration({
      topicName: broadcastId,
    });
  }, [alertName, config, inputs]);
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
