import clsx from 'clsx';
import React from 'react';

import { LoadingState } from '../../hooks';
import NotifiAlertBox, { NotifiAlertBoxProps } from '../NotifiAlertBox';
import Spinner from './Spinner';

export type LoadingStateCardProps = Readonly<{
  card: LoadingState;
  spinnerSize?: string;
  ringColor?: string;
  classNames?: Readonly<{
    container?: string;
    label?: string;
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
  }>;
  onClose?: () => void;
}>;

export const LoadingStateCard: React.FC<LoadingStateCardProps> = ({
  classNames,
  spinnerSize,
  ringColor,
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
          'NotifiLoadingStateCard__container',
          classNames?.container,
        )}
      >
        <label
          className={clsx('NotifiLoadingStateCard__label', classNames?.label)}
        >
          Loading...
        </label>
        <Spinner size={spinnerSize} ringColor={ringColor} />
      </div>
    </>
  );
};
