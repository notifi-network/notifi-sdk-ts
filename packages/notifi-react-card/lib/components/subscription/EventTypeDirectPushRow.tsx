import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { DirectPushEventTypeItem, useNotifiSubscribe } from '../../hooks';
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
  const { alerts, loading, demoPreview } = useNotifiSubscriptionContext();

  const subscribe = demoPreview
    ? null
    : useNotifiSubscribe({
        targetGroupName: 'Default',
      });
  const [enabled, setEnabled] = useState(false);

  const alertName = useMemo<string>(() => config.name, [config]);
  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    const pushId = resolveStringRef(alertName, config.directPushId, inputs);
    return directMessageConfiguration({
      type: pushId,
    });
  }, [alertName, config, inputs]);
  const tooltipContent = config.tooltipContent;

  useEffect(() => {
    if (loading) {
      return;
    }
    const hasAlert = alerts[alertName] !== undefined;
    setEnabled(hasAlert);
  }, [alertName, alerts, loading]);

  const handleNewSubscription = useCallback(() => {
    if (!subscribe) return;
    if (loading) {
      return;
    }
    if (!enabled) {
      subscribe.instantSubscribe({
        alertConfiguration: alertConfiguration,
        alertName: alertName,
      });
    } else {
      subscribe.instantSubscribe({
        alertConfiguration: null,
        alertName: alertName,
      });
    }
  }, [enabled, subscribe?.instantSubscribe, alertConfiguration, alertName]);

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
