import { useNotifiSubscriptionContext } from '../../context';
import { BroadcastEventTypeItem } from '../../hooks';
import {
  AlertConfiguration,
  DeepPartialReadonly,
  broadcastMessageConfiguration,
} from '../../utils';
import { resolveStringRef } from './resolveRef';
import React, { useEffect, useMemo, useState } from 'react';

type Props = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    input: string;
  }>;
  disabled: boolean;
  config: BroadcastEventTypeItem;
  inputs: Record<string, string | undefined>;
}>;

export const EventTypeBroadcastRow: React.FC<Props> = ({
  classNames,
  disabled,
  config,
  inputs,
}: Props) => {
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
    <div className={classNames?.container}>
      <div className={classNames?.label}>{config.name}</div>
      <input
        className={classNames?.input}
        disabled={disabled}
        type="checkbox"
        checked={enabled}
        onChange={(e) => {
          setEnabled(e.target.checked);
        }}
      />
    </div>
  );
};
