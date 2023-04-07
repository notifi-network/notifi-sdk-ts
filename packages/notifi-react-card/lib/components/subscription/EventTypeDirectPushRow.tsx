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
  const { alerts, loading } = useNotifiSubscriptionContext();

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
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
        alertConfiguration: alertConfiguration,
        alertName: alertName,
      });
    } else {
      instantSubscribe({
        alertConfiguration: null,
        alertName: alertName,
      });
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
