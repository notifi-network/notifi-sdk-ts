import clsx from 'clsx';
import React from 'react';

import { DeepPartialReadonly } from '../../utils';
import NotifiAlertBox, { NotifiAlertBoxProps } from '../NotifiAlertBox';

export type ErrorStateCardProps = Readonly<{
  copy?: DeepPartialReadonly<{
    header: string;
  }>;
  reason: string;
  classNames?: Readonly<{
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
    label?: string;
    errorMessage?: string;
  }>;
  onClose?: () => void;
}>;

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  copy,
  classNames,
  onClose,
  reason,
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
        <h2>{copy?.header ?? 'Something went wrong'}</h2>
      </NotifiAlertBox>
      <div
        className={clsx(
          'ErrorStateCard__errorMessage',
          classNames?.errorMessage,
        )}
      >
        {reason}
      </div>
    </>
  );
};
