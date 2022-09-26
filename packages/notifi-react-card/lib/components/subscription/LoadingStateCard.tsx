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
  return (
    <>
      <div className={classNames?.glimmer} />
      <div className={classNames?.glimmer} />
      <div className={classNames?.glimmer} />
    </>
  );
};
