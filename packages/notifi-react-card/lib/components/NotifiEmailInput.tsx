import React from 'react';
import { useNotifiCopyContext, useNotifiStyleContext, useNotifiSubscriptionContext } from '../context';
import { NotifiMail } from './NotifiMail';

type Props = Readonly<{
  disabled: boolean;
}>;

export const NotifiEmailInput: React.FC<Props> = ({ disabled }: Props) => {
  const { emailInput: copy } = useNotifiCopyContext();
  const { emailInput: styles } = useNotifiStyleContext();
  const { email, setEmail } = useNotifiSubscriptionContext();

  return (
    <div className={styles?.container}>
      <span className={styles?.iconSpan}>
        <NotifiMail className={styles?.iconSvg} />
      </span>
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
