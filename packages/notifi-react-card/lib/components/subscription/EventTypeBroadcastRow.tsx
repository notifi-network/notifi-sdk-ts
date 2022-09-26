import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { BroadcastEventTypeItem } from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  broadcastMessageConfiguration,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { resolveStringRef } from './resolveRef';

export type EventTypeBroadcastRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
  disabled: boolean;
  config: BroadcastEventTypeItem;
  inputs: Record<string, string | undefined>;
}>;

export const EventTypeBroadcastRow: React.FC<EventTypeBroadcastRowProps> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypeBroadcastRowProps) => {
  const { alerts, setAlertConfiguration } = useNotifiSubscriptionContext();
  const [enabled, setEnabled] = useState(true);

  const alertName = useMemo<string>(() => config.name, [config]);
  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    const broadcastId = resolveStringRef(alertName, config.broadcastId, inputs);
    return broadcastMessageConfiguration({
      topicName: broadcastId,
    });
  }, [alertName, config, inputs]);

  useEffect(() => {
    const hasAlert = alerts[alertName] !== undefined;
    setEnabled(hasAlert);
  }, [alerts]);

  useEffect(() => {
    if (enabled) {
      setAlertConfiguration(alertName, alertConfiguration);
    } else {
      setAlertConfiguration(alertName, null);
    }
  }, [enabled, alertName, alertConfiguration]);

  return (
    <div
      className={clsx(
        'EventTypeBroadcastRow__container',
        classNames?.container,
      )}
    >
      <div className={clsx('EventTypeBroadcastRow__label', classNames?.label)}>
        {config.name}
      </div>
      <NotifiToggle
        classNames={classNames?.toggle}
        disabled={disabled}
        checked={enabled}
        setChecked={setEnabled}
      />
    </div>
  );
};
