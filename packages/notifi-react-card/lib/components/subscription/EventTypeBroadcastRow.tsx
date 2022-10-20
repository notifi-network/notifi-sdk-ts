import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
  inputs: Record<string, string | undefined>;
}>;

export const EventTypeBroadcastRow: React.FC<EventTypeBroadcastRowProps> = ({
  classNames,
  config,
  disabled,
  inputs,
}: EventTypeBroadcastRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe();
  const [enabled, setEnabled] = useState(false);

  const alertName = useMemo<string>(() => config.name, [config]);
  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    const broadcastId = resolveStringRef(alertName, config.broadcastId, inputs);
    return broadcastMessageConfiguration({
      topicName: broadcastId,
    });
  }, [alertName, config, inputs]);

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
  }, [loading, enabled, instantSubscribe, alertConfiguration, alertName]);

  return (
    <div
      className={clsx(
        'EventTypeBroadcastRow__container',
        classNames?.container,
      )}
    >
      <div className={clsx('EventTypeBroadcastRow__label', classNames?.label)}>
        {config.name}
        <NotifiTooltip
          classNames={classNames?.toggle}
          content={config.tooltipContent}
        />
      </div>
      <NotifiToggle
        checked={enabled}
        classNames={classNames?.toggle}
        disabled={disabled}
        setChecked={handleNewSubscription}
      />
    </div>
  );
};
