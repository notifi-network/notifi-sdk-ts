import React from 'react';

import { DeepPartialReadonly } from '../../utils';

type Props = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
  }>;
}>;

export const EventTypeUnsupportedRow: React.FC<Props> = ({
  classNames,
}: Props) => {
  return (
    <div className={classNames?.container}>
      <div className={classNames?.label}>Unsupported Event Type</div>
    </div>
  );
};
