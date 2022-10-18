import clsx from 'clsx';
import React from 'react';

import { LabelEventTypeItem } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';

export type EventTypeLabelRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
  }>;
  config: LabelEventTypeItem;
}>;

export const EventTypeLabelRow: React.FC<EventTypeLabelRowProps> = ({
  classNames,
  config,
}: EventTypeLabelRowProps) => {
  return (
    <div
      className={clsx('EventTypeLabelRow__container', classNames?.container)}
    >
      <div className={clsx('EventTypeLabelRow__label', classNames?.label)}>
        {config.name}
      </div>
    </div>
  );
};
