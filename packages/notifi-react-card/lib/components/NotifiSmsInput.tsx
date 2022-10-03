import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import { splitPhoneNumber } from 'notifi-react-card/lib/utils/phoneUtils';
import React, { useCallback, useEffect, useState } from 'react';

export type NotifiSmsInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
  }>;
  disabled: boolean;
  allowedCountryCodes: string[];
}>;

export const NotifiSmsInput: React.FC<NotifiSmsInputProps> = ({
  classNames,
  copy,
  disabled,
  allowedCountryCodes,
}: NotifiSmsInputProps) => {
  const { phoneNumber, setPhoneNumber } = useNotifiSubscriptionContext();

  const [phoneValues, setPhoneValues] = useState({
    dialCode: '+1',
    baseNumber: '',
  });

  const splitPhoneValues = useCallback(() => {
    if (!phoneNumber) {
      return;
    }

    if (isValidPhoneNumber(phoneNumber)) {
      const { baseNumber: number, countryCallingCode } =
        splitPhoneNumber(phoneNumber);
      if (!countryCallingCode || !number) {
        throw new Error('Improper phone');
      }

      setPhoneValues({
        dialCode: `+${countryCallingCode}`,
        baseNumber: number,
      });
      return;
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (phoneNumber) {
      splitPhoneValues();
    }
  }, [phoneNumber, splitPhoneValues]);

  useEffect(() => {
    if (phoneValues.baseNumber === '') {
      setPhoneNumber('');
    }
  }, [phoneValues.baseNumber, setPhoneNumber]);

  const countryCodes = allowedCountryCodes.map((code) => {
    return (
      <option key={code} value={code}>
        {code}
      </option>
    );
  });

  const handleChange =
    (field: 'dialCode' | 'baseNumber') =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (field === 'baseNumber') {
        const onlyNumberInput = event.target.value.replace(/[^\d]/g, '');

        setPhoneValues({ ...phoneValues, [field]: onlyNumberInput });
      } else {
        setPhoneValues({ ...phoneValues, [field]: event.target.value });
      }
      if (field === 'dialCode') {
        setPhoneNumber(event.target.value + phoneValues.baseNumber);
      } else {
        setPhoneNumber(phoneValues.dialCode + event.target.value);
      }
    };

  return (
    <div className={clsx('NotifiSmsInput__container', classNames?.container)}>
      <div className={clsx('NotifiSmsInput__dropdownContainer')}>
        <select
          value={phoneValues.dialCode}
          onChange={handleChange('dialCode')}
          className={clsx('NotifiSmsInput__dropdownSelect')}
        >
          {countryCodes}
        </select>
      </div>
      <input
        className={clsx('NotifiSmsInput__input', classNames?.input)}
        disabled={disabled}
        name="notifi-sms"
        type="tel"
        value={phoneValues.baseNumber}
        onChange={handleChange('baseNumber')}
        placeholder={copy?.placeholder ?? 'Phone Number'}
      />
    </div>
  );
};
