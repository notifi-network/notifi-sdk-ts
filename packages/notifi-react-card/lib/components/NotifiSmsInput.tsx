import {
  useNotifiCopyContext,
  useNotifiStyleContext,
  useNotifiSubscriptionContext,
} from '../context';
import { getCountryCallingCode } from 'libphonenumber-js';
import React, { useMemo } from 'react';

type Props = Readonly<{
  disabled: boolean;
}>;

export const NotifiSmsInput: React.FC<Props> = ({ disabled }: Props) => {
  const { smsInput: copy } = useNotifiCopyContext();
  const { smsInput: styles } = useNotifiStyleContext();
  const { countryCode, phoneNumber, setPhoneNumber } =
    useNotifiSubscriptionContext();

  const countryCallingCode = useMemo(() => {
    return getCountryCallingCode(countryCode);
  }, [countryCode]);

  return (
    <div className={styles?.container}>
      <span className={styles?.countryCodeSpan}>+{countryCallingCode}</span>
      <input
        className={styles?.input}
        disabled={disabled}
        name="notifi-sms"
        type="tel"
        value={phoneNumber}
        onBlur={(e) => {
          setPhoneNumber(e.target.value ?? '');
        }}
        placeholder={copy?.placeholder ?? 'PhoneNumber'}
      />
    </div>
  );
};
