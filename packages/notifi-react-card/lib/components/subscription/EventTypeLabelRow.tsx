import clsx from 'clsx';
import React from 'react';

import { LabelEventTypeItem } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';

export type EventTypeLabelRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  config: LabelEventTypeItem;
}>;

export const EventTypeLabelRow: React.FC<EventTypeLabelRowProps> = ({
  classNames,
  config,
}: EventTypeLabelRowProps) => {
  const { name, tooltipContent } = config;

  return (
    <div
      className={clsx('EventTypeLabelRow__container', classNames?.container)}
    >
      <div className={clsx('EventTypeLabelRow__label', classNames?.label)}>
        {name}
        {tooltipContent !== undefined && tooltipContent.length > 0 ? (
          <NotifiTooltip
            classNames={classNames?.tooltip}
            content={tooltipContent}
          />
        ) : null}
      </div>
    </div>
  );
};
