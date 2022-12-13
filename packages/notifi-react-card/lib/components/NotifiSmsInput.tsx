import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { SmsIcon } from '../assets/SmsIcon';
import { useNotifiForm } from '../context';
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
  intercomView?: boolean;
}>;

export const NotifiSmsInput: React.FC<NotifiSmsInputProps> = ({
  allowedCountryCodes,
  classNames,
  copy,
  disabled,
  intercomSmsDropdownContainerStyle,
  intercomSmsDropdownSelectStyle,
  intercomSmsInputContainerStyle,
  intercomSmsInputStyle,
  intercomView,
}: NotifiSmsInputProps) => {
  const {
    formErrorMessages,
    formState,
    setPhoneNumber,
    setPhoneNumberErrorMessage,
  } = useNotifiForm();

  const { phoneNumber: phoneNumberErrorMessage } = formErrorMessages;

  const { phoneNumber } = formState;

  const [phoneValues, setPhoneValues] = useState({
    baseNumber: '',
    dialCode: '+1',
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
        baseNumber: number,
        dialCode: `+${countryCallingCode}`,
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
    if (phoneValues.baseNumber === '' && phoneNumber !== '') {
      setPhoneNumber('');
    }
  }, [phoneValues.baseNumber, setPhoneNumber, phoneNumber]);

  const countryCodes = useMemo(() => {
    return allowedCountryCodes.map((code) => {
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
  }, [allowedCountryCodes, classNames]);

  const validateSmsInput = useCallback(() => {
    if (phoneNumber === '') {
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneNumberErrorMessage(
        'The phone number is invalid. Please try again',
      );
    }
  }, [phoneNumber, setPhoneNumberErrorMessage]);

  const handleChange = useCallback(
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
      },
    [phoneValues, setPhoneNumber, setPhoneValues],
  );

  return (
    <>
      {intercomView ? null : (
        <label className={clsx('NotifiSmsInput__label', classNames?.label)}>
          {copy?.label}
        </label>
      )}
      <div
        className={clsx(
          'NotifiSmsInput__container',
          intercomSmsInputContainerStyle,
          classNames?.container,
        )}
      >
        <SmsIcon className={'NotifiInput__icon'} />
        <div
          className={clsx(
            'NotifiSmsInput__dropdownContainer',
            intercomSmsDropdownContainerStyle,
            classNames?.dropdownContainer,
          )}
        >
          <select
            className={clsx(
              'NotifiSmsInput__dropdownSelect',
              intercomSmsDropdownSelectStyle,
              classNames?.dropdownSelectField,
            )}
            onChange={handleChange('dialCode')}
            value={phoneValues.dialCode}
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
          onChange={handleChange('baseNumber')}
          onFocus={() => setPhoneNumberErrorMessage('')}
          placeholder={copy?.placeholder ?? 'Phone Number'}
          type="tel"
          value={phoneValues.baseNumber}
        />
      </div>
      <label
        className={clsx(
          'NotifiSmsInput__errorMessage',
          classNames?.errorMessage,
        )}
      >
        {phoneNumberErrorMessage}
      </label>
    </>
  );
};
