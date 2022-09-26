import clsx from 'clsx';
import React from 'react';

import { DeepPartialReadonly } from '../../utils';

export type EventTypeUnsupportedRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
  }>;
}>;

export const EventTypeUnsupportedRow: React.FC<
  EventTypeUnsupportedRowProps
> = ({ classNames }: EventTypeUnsupportedRowProps) => {
  return (
    <div
      className={clsx(
        'EventTypeUnsupportedRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx('EventTypeUnsupportedRow__label', classNames?.label)}
      >
        Unsupported Event Type
      </div>
    </div>
  );
};
