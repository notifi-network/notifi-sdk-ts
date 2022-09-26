import clsx from 'clsx';
import React from 'react';

import { ErrorState } from '../../hooks';

export type ErrorStateCardProps = Readonly<{
  card: ErrorState;
  classNames?: Readonly<{
    label?: string;
    errorMessage?: string;
  }>;
}>;

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  card,
  classNames,
}) => {
  return (
    <>
      <div className={clsx('ErrorStateCard__label', classNames?.label)}>
        Something went wrong.
      </div>
      <div
        className={clsx(
          'ErrorStateCard__errorMessage',
          classNames?.errorMessage,
        )}
      >{`${card.reason}`}</div>
    </>
  );
};
