import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CustomTopicTypeItem, useNotifiSubscribe } from '../../hooks';
import { AlertConfiguration, DeepPartialReadonly } from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';

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
> = ({ classNames, disabled, config }: EventTypeCustomToggleRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();

  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const [enabled, setEnabled] = useState(false);

  const alertName = useMemo<string>(() => config.name, [config]);

  const alertConfiguration = useMemo<AlertConfiguration>(() => {
    return {
      sourceType: config.sourceType ?? 'DIRECT_PUSH',
      createSource: config.sourceAddress,
      filterType: config.filterType ?? 'DIRECT_TENANT_MESSAGES',
      filterOptions: config.filterOptions ?? {},
    };
  }, [alertName, config]);
  const tooltipContent = config.tooltipContent;

  console.log('alert name', alertName);

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

    console.log('alert config', alertConfiguration, 'alertName', alertName);
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
        disabled={disabled}
        checked={enabled}
        setChecked={handleNewSubscription}
      />
    </div>
  );
};
