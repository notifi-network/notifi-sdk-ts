import clsx from 'clsx';
import React from 'react';

import { LoadingState } from '../../hooks';
import Spinner from './Spinner';

export type LoadingStateCardProps = Readonly<{
  card: LoadingState;
  classNames?: Readonly<{
    container?: string;
    label?: string;
  }>;
}>;

export const LoadingStateCard: React.FC<LoadingStateCardProps> = ({
  classNames,
}) => {
  return (
    <div
      className={clsx(
        'NotifiLoadingStateCard__container',
        classNames?.container,
      )}
    >
      <label
        className={clsx('NotifiLoadingStateCard__label', classNames?.label)}
      >
        Loading...
      </label>
      <Spinner size="60px" />
    </div>
  );
};
