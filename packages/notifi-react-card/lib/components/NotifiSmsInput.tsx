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
    label: string;
    errorMessage: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  allowedCountryCodes: string[];
  intercomSmsInputStyle?: string;
  intercomSmsDropdownContainerStyle?: string;
  intercomSmsDropdownSelectStyle?: string;
  intercomSmsInputContainerStyle?: string;
}>;

export const NotifiSmsInput: React.FC<NotifiSmsInputProps> = ({
  classNames,
  copy,
  disabled,
  allowedCountryCodes,
  intercomSmsInputStyle,
  intercomSmsDropdownContainerStyle,
  intercomSmsDropdownSelectStyle,
  intercomSmsInputContainerStyle,
}: NotifiSmsInputProps) => {
  const { phoneNumber, setPhoneNumber, setSmsErrorMessage, smsErrorMessage } =
    useNotifiSubscriptionContext();

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

  const validateSmsInput = () => {
    if (phoneNumber === '') {
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setSmsErrorMessage('The phone number is invalid. Please try again');
    }
  };

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
    <>
      <label className={clsx('NotifiSmsInput__label', classNames?.label)}>
        {copy?.label}
      </label>
      <div
        className={clsx(
          'NotifiSmsInput__container',
          intercomSmsInputContainerStyle,
          classNames?.container,
        )}
      >
        <div
          className={clsx(
            'NotifiSmsInput__dropdownContainer',
            intercomSmsDropdownContainerStyle,
            classNames?.dropdownContainer,
          )}
        >
          <select
            value={phoneValues.dialCode}
            onChange={handleChange('dialCode')}
            className={clsx(
              'NotifiSmsInput__dropdownSelect',
              intercomSmsDropdownSelectStyle,
              classNames?.dropdownSelectField,
            )}
          >
            {countryCodes}
          </select>
        </div>
        <input
          className={clsx(
            'NotifiSmsInput__input',
            intercomSmsInputStyle,
            classNames?.input,
          )}
          disabled={disabled}
          name="notifi-sms"
          onBlur={validateSmsInput}
          onFocus={() => setSmsErrorMessage('')}
          type="tel"
          value={phoneValues.baseNumber}
          onChange={handleChange('baseNumber')}
          placeholder={copy?.placeholder ?? 'Phone Number'}
        />
      </div>
      <label
        className={clsx(
          'NotifiSmsInput__errorMessage',
          classNames?.errorMessage,
        )}
      >
        {smsErrorMessage}
      </label>
    </>
  );
};
