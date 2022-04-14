import { useNotifiCopyContext } from '../context';
import { useNotifiSubscriptionContext } from '../context';
import { NotifiIconInput } from './NotifiIconInput';
import { NotifiMail } from './NotifiMail';
import React from 'react';

export const NotifiEmailInput: React.FC = () => {
  const { emailInput: copy } = useNotifiCopyContext();
  const { email, setEmail } = useNotifiSubscriptionContext();

  return (
    <NotifiIconInput
      icon={<NotifiMail />}
      name="notifi-email"
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value ?? '');
      }}
      placeholder={copy?.placeholder ?? 'Email Address'}
    />
  );
};
