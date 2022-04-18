import {
  useNotifiCopyContext,
  useNotifiStyleContext,
  useNotifiSubscriptionContext,
} from '../context';
import React from 'react';

type Props = Readonly<{
  disabled: boolean;
}>;

export const NotifiEmailInput: React.FC<Props> = ({ disabled }: Props) => {
  const { emailInput: copy } = useNotifiCopyContext();
  const { emailInput: styles } = useNotifiStyleContext();
  const { email, setEmail } = useNotifiSubscriptionContext();

  return (
    <div className={styles?.container}>
      <input
        className={styles?.input}
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
