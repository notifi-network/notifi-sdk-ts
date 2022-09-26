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
    <div className={classNames?.container}>
      <div className={classNames?.label}>Unsupported Event Type</div>
    </div>
  );
};
