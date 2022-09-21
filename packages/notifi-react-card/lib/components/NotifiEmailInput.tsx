import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';

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

export const NotifiEmailInput: React.FC<Props> = ({
  classNames,
  copy,
  disabled,
}: Props) => {
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
