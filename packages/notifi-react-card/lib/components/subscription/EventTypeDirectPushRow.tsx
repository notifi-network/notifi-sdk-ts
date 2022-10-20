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
  inputs: Record<string, string | undefined>;
}>;

export const EventTypeDirectPushRow: React.FC<EventTypeDirectPushRowProps> = ({
  classNames,
  disabled,
  config,
  inputs,
}: EventTypeDirectPushRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();

  const { instantSubscribe } = useNotifiSubscribe();
  const [enabled, setEnabled] = useState(false);

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
        <NotifiTooltip
          classNames={classNames?.toggle}
          content={config.tooltipContent}
        />
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
