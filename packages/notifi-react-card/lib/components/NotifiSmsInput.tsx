import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';
import React from 'react';

type Props = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
  }>;
  disabled: boolean;
}>;

export const NotifiSmsInput: React.FC<Props> = ({
  classNames,
  copy,
  disabled,
}: Props) => {
  const { phoneNumber, setPhoneNumber } = useNotifiSubscriptionContext();

  return (
    <div className={classNames?.container}>
      <input
        className={classNames?.input}
        disabled={disabled}
        name="notifi-sms"
        type="tel"
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value ?? '');
        }}
        placeholder={copy?.placeholder ?? 'PhoneNumber'}
      />
    </div>
  );
};
