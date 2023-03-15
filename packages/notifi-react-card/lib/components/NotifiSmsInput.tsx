import clsx from 'clsx';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useEffect, useState } from 'react';

import { SmsIcon } from '../assets/SmsIcon';
import { DialCode, countryMap } from '../constants/countryData';
import { useNotifiForm } from '../context';
import type { DeepPartialReadonly } from '../utils';
import { splitPhoneNumber } from '../utils/phoneUtils';
import NotifiSmsDropdownOption from './NotifiSmsDropdownOption';

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
    setHasChanges,
  } = useNotifiForm();

  const { phoneNumber: phoneNumberErrorMessage } = formErrorMessages;

  const { phoneNumber } = formState;

  const [phoneValues, setPhoneValues] = useState({
    baseNumber: '',
    dialCode: '+1',
  });
  const [isShowOption, setShowOption] = useState(false);

  const handleShowOption = () => {
    setShowOption(!isShowOption);
  };

  const handleSelected = useCallback(
    (dialCode: string) => {
      setPhoneValues({ ...phoneValues, dialCode });
      setPhoneNumber(dialCode + phoneValues.baseNumber);
      setShowOption(false);
    },
    [phoneValues, setPhoneNumber, setPhoneValues],
  );

  const handleBaseNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const onlyNumberInput = event.target.value.replace(/[^\d]/g, '');

      setPhoneValues({ ...phoneValues, baseNumber: onlyNumberInput });
      setPhoneNumber(phoneValues.dialCode + event.target.value);
    },
    [phoneValues, setPhoneNumber, setPhoneValues],
  );

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
  }, [phoneNumber, handleSelected]);

  useEffect(() => {
    if (phoneNumber) {
      splitPhoneValues();
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (phoneValues.baseNumber === '' && phoneNumber !== '') {
      setPhoneNumber('');
    }
  }, [phoneValues.baseNumber, setPhoneNumber, phoneNumber]);

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
          <div
            className={clsx(
              'NotifiSmsInput__dropdownSelect',
              intercomSmsDropdownSelectStyle,
              classNames?.dropdownSelectField,
            )}
            tabIndex={0}
            onBlur={() => {
              setShowOption(false);
            }}
          >
            <div
              className="NotifiSmsInput__dropdownSelected"
              onClick={handleShowOption}
            >
              <div className="NotifiSmsInput__dropdownSelectValue">
                {phoneValues.dialCode}
              </div>
              <input
                className="NotifiSmsInput__dropdownInput"
                type="hidden"
                value={phoneValues.dialCode}
                onChange={(e) => {
                  setHasChanges(true);
                  handleBaseNumberChange(e);
                }}
              />
              <svg
                className="NotifiSmsInput__dropdownSelectIcon"
                viewBox="0 0 9 5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.539062 0.916016L4.4974 4.87435L8.45573 0.916016H0.539062Z"
                  fill="inherit"
                />
              </svg>
            </div>
            {isShowOption && (
              <ul className="NotifiSmsInput__dropdownOptionList">
                {allowedCountryCodes.map((code) => {
                  const countryData = countryMap[code as DialCode];
                  return (
                    <NotifiSmsDropdownOption
                      key={code}
                      countryData={countryData}
                      phoneValues={phoneValues}
                      onSelected={(dialCode) => handleSelected(dialCode)}
                    />
                  );
                })}
              </ul>
            )}
          </div>
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
          onChange={(e) => {
            setHasChanges(true);
            handleBaseNumberChange(e);
          }}
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
