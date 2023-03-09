import clsx from 'clsx';
import React from 'react';

import { ErrorState } from '../../hooks';
import NotifiAlertBox, { NotifiAlertBoxProps } from '../NotifiAlertBox';

export type ErrorStateCardProps = Readonly<{
  card: ErrorState;
  classNames?: Readonly<{
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
    label?: string;
    errorMessage?: string;
  }>;
  onClose?: () => void;
}>;

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  card,
  classNames,
  onClose,
}) => {
  return (
    <>
      <NotifiAlertBox
        classNames={classNames?.NotifiAlertBox}
        rightIcon={
          onClose === undefined
            ? undefined
            : {
                name: 'close',
                onClick: onClose,
              }
        }
      >
        <h2>Something went wrong</h2>
      </NotifiAlertBox>
      <div
        className={clsx(
          'ErrorStateCard__errorMessage',
          classNames?.errorMessage,
        )}
      >{`${card.reason}`}</div>
    </>
  );
};
