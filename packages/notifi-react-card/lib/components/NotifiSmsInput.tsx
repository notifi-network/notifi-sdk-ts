import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';

export type NotifiSmsInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
  }>;
  disabled: boolean;
}>;

export const NotifiSmsInput: React.FC<NotifiSmsInputProps> = ({
  classNames,
  copy,
  disabled,
}: NotifiSmsInputProps) => {
  const { phoneNumber, setPhoneNumber } = useNotifiSubscriptionContext();

  return (
    <div className={clsx('NotifiSmsInput__container', classNames?.container)}>
      <input
        className={clsx('NotifiSmsInput__input', classNames?.input)}
        disabled={disabled}
        name="notifi-sms"
        type="tel"
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value ?? '');
        }}
        placeholder={copy?.placeholder ?? 'Phone Number'}
      />
    </div>
  );
};
