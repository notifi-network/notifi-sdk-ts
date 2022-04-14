import {
  useNotifiCopyContext,
  useNotifiStyleContext,
  useNotifiSubscriptionContext,
} from '../context';
import { NotifiSms } from './NotifiSms';
import React from 'react';

export const NotifiSmsInput: React.FC = () => {
  const { smsInput: copy } = useNotifiCopyContext();
  const { smsInput: styles } = useNotifiStyleContext();
  const { phoneNumber, setPhoneNumber } = useNotifiSubscriptionContext();

  return (
    <div className={styles?.container}>
      <span className={styles?.iconSpan}>
        <NotifiSms className={styles?.iconSvg} />
        <span className={styles?.countryCodeSpan}>+1</span>
      </span>
      <input
        className={styles?.input}
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
