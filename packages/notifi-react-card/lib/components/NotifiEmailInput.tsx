import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';

export type NotifiEmailInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
  }>;
  disabled: boolean;
}>;

export const NotifiEmailInput: React.FC<NotifiEmailInputProps> = ({
  classNames,
  copy,
  disabled,
}: NotifiEmailInputProps) => {
  const { email, setEmail } = useNotifiSubscriptionContext();

  return (
    <div className={classNames?.container}>
      <input
        className={classNames?.input}
        disabled={disabled}
        name="notifi-email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value ?? '');
        }}
        placeholder={copy?.placeholder ?? 'Email Address'}
      />
    </div>
  );
};
