import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { XMTPTopicTypeItem, useNotifiSubscribe } from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  XMTPToggleConfiguration,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringArrayRef } from './resolveRef';

export type EventTypeXMPTRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: XMTPTopicTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeXMTPRow: React.FC<EventTypeXMPTRowProps> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypeXMPTRowProps) => {
  const { alerts, loading, demoPreview } = useNotifiSubscriptionContext();

  const subscribe = demoPreview
    ? null
    : useNotifiSubscribe({
        targetGroupName: 'Default',
      });
  const alertName = useMemo<string>(() => config.name, [config]);

  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    return XMTPToggleConfiguration({
      XMTPTopics: resolveStringArrayRef(config.name, config.XMTPTopics, inputs),
    });
  }, [alertName, config]);

  const [enabled, setEnabled] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

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
          setEnabled(true);
        })
        .finally(() => {
          setIsNotificationLoading(false);
        });
    }
  }, [
    enabled,
    alerts,
    subscribe?.instantSubscribe,
    alertName,
    isNotificationLoading,
    setEnabled,
    setIsNotificationLoading,
  ]);

  return (
    <div className={clsx('EventTypeXMTPRow__container', classNames?.container)}>
      <div className={clsx('EventTypeXMTPRow__label', classNames?.label)}>
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
