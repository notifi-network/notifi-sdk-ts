import {
  useNotifiCopyContext,
  useNotifiStyleContext,
  useNotifiSubscriptionContext,
} from '../context';
import { NotifiMail } from './NotifiMail';
import React from 'react';

export const NotifiEmailInput: React.FC = () => {
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
