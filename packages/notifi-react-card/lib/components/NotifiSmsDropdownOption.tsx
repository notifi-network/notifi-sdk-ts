import clsx from 'clsx';
import React from 'react';

import { CountryMetadata } from '../constants/countryData';
import type { DeepPartialReadonly } from '../utils';

type DropdownOptionType = {
  countryData: CountryMetadata;
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
    dropdownContainer: string;
    dropdownOption: string;
    dropdownSelectField: string;
    label: string;
    errorMessage: string;
  }>;
  phoneValues: {
    baseNumber: string;
    dialCode: string;
  };
  onSelected: (dialCode: string) => void;
};

const NotifiSmsDropdownOption: React.FC<DropdownOptionType> = ({
  countryData,
  classNames,
  phoneValues,
  onSelected,
}) => {
  const { name, dialCode, flag } = countryData;

  return (
    <li
      className={clsx(
        'NotifiSmsInput__dropdownOption',
        classNames?.dropdownOption,
        {
          'NotifiSmsInput__dropdownOption-selected':
            phoneValues.dialCode === dialCode,
        },
      )}
      onClick={() => onSelected(dialCode)}
    >
      <div className="NotifiSmsInput__dropdownCountry">
        <p className="NotifiSmsInput__dropdownFlag">{flag} </p>
        <p className="NotifiSmsInput__dropdownName">{name}</p>
      </div>
      <span className="NotifiSmsInput__dropdownCode">{dialCode}</span>
    </li>
  );
};

export default NotifiSmsDropdownOption;
