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
      <div className={classNames?.label}>Something went wrong.</div>
      <div className={classNames?.errorMessage}>{`${card.reason}`}</div>
    </>
  );
};
