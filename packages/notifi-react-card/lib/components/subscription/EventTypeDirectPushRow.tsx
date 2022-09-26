import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { DirectPushEventTypeItem } from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  directMessageConfiguration,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { resolveStringRef } from './resolveRef';

export type EventTypeDirectPushRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
  disabled: boolean;
  config: DirectPushEventTypeItem;
  inputs: Record<string, string | undefined>;
}>;

export const EventTypeDirectPushRow: React.FC<EventTypeDirectPushRowProps> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypeDirectPushRowProps) => {
  const { alerts, loading, setAlertConfiguration } =
    useNotifiSubscriptionContext();
  const [enabled, setEnabled] = useState(true);

  const alertName = useMemo<string>(() => config.name, [config]);
  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    const pushId = resolveStringRef(alertName, config.directPushId, inputs);
    return directMessageConfiguration({
      type: pushId,
    });
  }, [alertName, config, inputs]);

  useEffect(() => {
    if (loading) {
      return;
    }
    const hasAlert = alerts[alertName] !== undefined;
    setEnabled(hasAlert);
  }, [alerts, loading]);

  useEffect(() => {
    if (enabled) {
      setAlertConfiguration(alertName, alertConfiguration);
    } else {
      setAlertConfiguration(alertName, null);
    }
  }, [enabled, alertName, alertConfiguration, setAlertConfiguration]);

  return (
    <div
      className={clsx(
        'EventTypeDirectPushRow__container',
        classNames?.container,
      )}
    >
      <div className={clsx('EventTypeDirectPushRow__label', classNames?.label)}>
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
