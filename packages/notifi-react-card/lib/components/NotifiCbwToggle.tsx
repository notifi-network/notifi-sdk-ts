import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import { DeepPartialReadonly } from '../utils';
import { NotifiToggle, NotifiToggleProps } from './subscription';

export type NotifiCbwToggleProps = Readonly<{
  disabled: boolean;
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
}>;

export const NotifiCbwToggle: React.FC<NotifiCbwToggleProps> = ({
  classNames,
  disabled,
}) => {
  const { useWeb3, setUseWeb3 } = useNotifiSubscriptionContext();

  return (
    <div
      className={clsx('NotifiCbwToggle__container', classNames?.container)}
    >
      <div className={clsx('NotifiCbwToggle__label', classNames?.label)}>
        Wallet Alerts
      </div>
      <NotifiToggle
        classNames={classNames?.toggle}
        disabled={disabled}
        checked={useWeb3}
        setChecked={setUseWeb3}
      />
    </div>
  );
};
