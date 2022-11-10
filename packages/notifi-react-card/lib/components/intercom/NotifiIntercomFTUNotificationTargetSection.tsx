import clsx from 'clsx';
import { CardConfigItemV1 } from 'notifi-react-card/lib/hooks';
import React from 'react';

import { NotifiEmailInput, NotifiEmailInputProps } from '../NotifiEmailInput';
import { NotifiSmsInput, NotifiSmsInputProps } from '../NotifiSmsInput';
import {
  NotifiTelegramInput,
  NotifiTelegramInputProps,
} from '../NotifiTelegramInput';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from '../subscription/NotifiSubscriptionCard';
import { NotifiToggle, NotifiToggleProps } from '../subscription/NotifiToggle';

export type NotifiIntercomFTUNotificationTargetSectionProps = Readonly<{
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiSmsInput?: NotifiSmsInputProps['classNames'];
    NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
  data: CardConfigItemV1;
  inputs: Record<string, string | undefined>;
  inputLabels?: NotifiInputLabels;
  inputSeparators?: NotifiInputSeparators;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export const NotifiIntercomFTUNotificationTargetSection: React.FC<
  NotifiIntercomFTUNotificationTargetSectionProps
> = ({
  data,
  inputSeparators,
  classNames,
  inputLabels,
  checked,
  setChecked,
}) => {
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];

  return (
    <div className={'NotifiSupportNotificationOption__container'}>
      <NotifiEmailInput
        disabled={false}
        classNames={classNames?.NotifiEmailInput}
        copy={{ label: inputLabels?.email }}
        intercomEmailInputContainerStyle={'NotifiIntercomEmailInput__container'}
        intercomEmailInputStyle={'NotifiIntercomEmailInput__input'}
      />
      {inputSeparators?.emailSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
            'NotifiIntercomInputSeparator__container',
            inputSeparators?.emailSeparator?.classNames?.container,
          )}
        >
          <div
            className={clsx(
              'NotifiInputSeparator__content',
              inputSeparators.emailSeparator.classNames?.content,
            )}
          >
            {inputSeparators?.emailSeparator?.content}
          </div>
        </div>
      ) : null}
      <NotifiSmsInput
        disabled={false}
        classNames={classNames?.NotifiSmsInput}
        allowedCountryCodes={allowedCountryCodes}
        copy={{ label: inputLabels?.sms }}
        intercomSmsInputContainerStyle={'NotifiIntercomSmsInput__container'}
        intercomSmsInputStyle={'NotifiIntercomSmsInput__input'}
        intercomSmsDropdownContainerStyle={
          'NotifiIntercomSmsInput__dropdownContainer'
        }
        intercomSmsDropdownSelectStyle={
          'NotifiIntercomSmsInput__dropdownSelect'
        }
      />
      {inputSeparators?.smsSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
            'NotifiIntercomInputSeparator__container',
            inputSeparators?.smsSeparator?.classNames?.container,
          )}
        >
          <div
            className={clsx(
              'NotifiInputSeparator__content',
              inputSeparators.smsSeparator.classNames?.content,
            )}
          >
            {inputSeparators?.smsSeparator?.content}
          </div>
        </div>
      ) : null}
      <NotifiTelegramInput
        disabled={false}
        classNames={classNames?.NotifiTelegramInput}
        copy={{ label: inputLabels?.telegram }}
        intercomTelegramInputContainerStyle={
          'NotifiIntercomTelegramInput__container'
        }
        intercomTelegramInputStyle={'NotifiIntercomTelegramInput__input'}
      />
      {inputSeparators?.telegramSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
            'NotifiIntercomInputSeparator__container',
            inputSeparators?.smsSeparator?.classNames?.container,
          )}
        >
          <div
            className={clsx(
              'NotifiInputSeparator__content',
              inputSeparators.telegramSeparator.classNames?.content,
            )}
          >
            {inputSeparators?.telegramSeparator?.content}
          </div>
        </div>
      ) : null}
      <div
        className={clsx('BrowserAlertToggle__container', classNames?.container)}
      >
        <div className={clsx('BrowserAlertToggle__label', classNames?.label)}>
          Opt in to browser alerts
        </div>

        <NotifiToggle
          classNames={classNames?.toggle}
          disabled={false}
          checked={checked}
          setChecked={setChecked}
          intercomToggleStyle={'NotifiIntercomToggle__input'}
        />
      </div>
    </div>
  );
};
