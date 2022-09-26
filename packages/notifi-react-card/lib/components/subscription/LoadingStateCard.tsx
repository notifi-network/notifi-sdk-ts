import clsx from 'clsx';
import React from 'react';

import { LoadingState } from '../../hooks';

export type LoadingStateCardProps = Readonly<{
  card: LoadingState;
  classNames?: Readonly<{
    glimmer?: string;
  }>;
}>;

export const LoadingStateCard: React.FC<LoadingStateCardProps> = ({
  classNames,
}) => {
  const clz = clsx('LoadingStateCard__glimmer', classNames?.glimmer);
  return (
    <>
      <div className={clz} />
      <div className={clz} />
      <div className={clz} />
    </>
  );
};
