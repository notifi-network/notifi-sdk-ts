import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';
import { getCountryCallingCode } from 'libphonenumber-js';
import React, { useMemo } from 'react';

type Props = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    countryCodeSpan: string;
    input: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
  }>;
  disabled: boolean;
}>;

export const NotifiSmsInput: React.FC<Props> = ({
  classNames,
  copy,
  disabled,
}: Props) => {
  const { phoneNumber, setPhoneNumber } = useNotifiSubscriptionContext();

  const countryCallingCode = useMemo(() => {
    return getCountryCallingCode('US'); // TODO
  }, []);

  return (
    <div className={classNames?.container}>
      <span className={classNames?.countryCodeSpan}>+{countryCallingCode}</span>
      <input
        className={classNames?.input}
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
