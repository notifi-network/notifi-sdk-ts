import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useEffect, useState } from 'react';

import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';
import { splitPhoneNumber } from '../utils/phoneUtils';

export type NotifiSmsInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
    dropdownContainer: string;
    dropdownOption: string;
    dropdownSelectField: string;
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
      <option
        className={clsx(
          'NotifiSmsInput__dropdownOption',
          classNames?.dropdownOption,
        )}
        key={code}
        value={code}
      >
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
      <div
        className={clsx(
          'NotifiSmsInput__dropdownContainer',
          classNames?.dropdownContainer,
        )}
      >
        <select
          value={phoneValues.dialCode}
          onChange={handleChange('dialCode')}
          className={clsx(
            'NotifiSmsInput__dropdownSelect',
            classNames?.dropdownSelectField,
          )}
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
