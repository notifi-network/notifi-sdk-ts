import React from 'react';
import { useNotifiCopyContext, useNotifiStyleContext, useNotifiSubscriptionContext } from '../context';
import { NotifiSms } from './NotifiSms';

type Props = Readonly<{
  disabled: boolean;
}>;

export const NotifiSmsInput: React.FC<Props> = ({ disabled }: Props) => {
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
