import {
  useNotifiCopyContext,
  useNotifiStyleContext,
  useNotifiSubscriptionContext,
} from '../context';
import { NotifiIconInput } from './NotifiIconInput';
import { NotifiSms } from './NotifiSms';
import React from 'react';

export const NotifiSmsInput: React.FC = () => {
  const { phoneNumber, setPhoneNumber } = useNotifiSubscriptionContext();
  const { smsInput: copy } = useNotifiCopyContext();
  const { smsInput: styles } = useNotifiStyleContext();

  return (
    <NotifiIconInput
      icon={
        <>
          <NotifiSms />
          <span className={styles?.countryCodeSpan}>+1</span>
        </>
      }
      name="notifi-phone"
      type="tel"
      value={phoneNumber}
      onChange={(e) => {
        setPhoneNumber(e.target.value ?? '');
      }}
      placeholder={copy?.placeholder ?? 'Phone Number'}
    />
  );
};
