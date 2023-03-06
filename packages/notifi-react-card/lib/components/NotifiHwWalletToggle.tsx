import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import { DeepPartialReadonly } from '../utils';
import { NotifiToggle, NotifiToggleProps } from './subscription';

export type NotifiHwWalletToggleProps = Readonly<{
  disabled: boolean;
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
}>;

export const NotifiHwWalletToggle: React.FC<NotifiHwWalletToggleProps> = ({
  classNames,
  disabled,
}) => {
  const { useHardwareWallet, setUseHardwareWallet } =
    useNotifiSubscriptionContext();

  return (
    <div
      className={clsx('NotifiHwWalletToggle__container', classNames?.container)}
    >
      <div className={clsx('NotifiHwWalletToggle__label', classNames?.label)}>
        Use hardware wallet
      </div>
      <NotifiToggle
        classNames={classNames?.toggle}
        disabled={disabled}
        checked={useHardwareWallet}
        setChecked={setUseHardwareWallet}
      />
    </div>
  );
};
