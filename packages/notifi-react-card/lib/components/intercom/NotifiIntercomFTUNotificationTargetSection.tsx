import clsx from 'clsx';
import React from 'react';

import { IntercomCardConfigItemV1 } from '../../hooks/IntercomCardConfig';
import { NotifiEmailInput, NotifiEmailInputProps } from '../NotifiEmailInput';
import { NotifiSmsInput, NotifiSmsInputProps } from '../NotifiSmsInput';
import {
  NotifiTelegramInput,
  NotifiTelegramInputProps,
} from '../NotifiTelegramInput';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from '../subscription/NotifiSubscriptionCard';
import { NotifiToggleProps } from '../subscription/NotifiToggle';

export type NotifiIntercomFTUNotificationTargetSectionProps = Readonly<{
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiSmsInput?: NotifiSmsInputProps['classNames'];
    NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
  data: IntercomCardConfigItemV1;
  inputs: Record<string, unknown>;
  inputTextFields?: NotifiInputFieldsText;
  inputSeparators?: NotifiInputSeparators;
}>;

export const NotifiIntercomFTUNotificationTargetSection: React.FC<
  NotifiIntercomFTUNotificationTargetSectionProps
> = ({ data, inputSeparators, classNames, inputTextFields }) => {
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];

  return (
    <div className={'NotifiSupportNotificationOption__container'}>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput
          disabled={false}
          classNames={classNames?.NotifiEmailInput}
          copy={{ label: inputTextFields?.label?.email }}
          intercomEmailInputContainerStyle={
            'NotifiIntercomEmailInput__container'
          }
          intercomEmailInputStyle={'NotifiIntercomEmailInput__input'}
          intercomView={true}
        />
      ) : null}
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
      {data.contactInfo.sms.active ? (
        <NotifiSmsInput
          disabled={false}
          classNames={classNames?.NotifiSmsInput}
          allowedCountryCodes={allowedCountryCodes}
          copy={{ label: inputTextFields?.label?.sms }}
          intercomSmsInputContainerStyle={'NotifiIntercomSmsInput__container'}
          intercomSmsInputStyle={'NotifiIntercomSmsInput__input'}
          intercomSmsDropdownContainerStyle={
            'NotifiIntercomSmsInput__dropdownContainer'
          }
          intercomSmsDropdownSelectStyle={
            'NotifiIntercomSmsInput__dropdownSelect'
          }
          intercomView={true}
        />
      ) : null}
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
      {data.contactInfo.telegram.active ? (
        <NotifiTelegramInput
          disabled={false}
          classNames={classNames?.NotifiTelegramInput}
          copy={{ label: inputTextFields?.label?.telegram }}
          intercomTelegramInputContainerStyle={
            'NotifiIntercomTelegramInput__container'
          }
          intercomTelegramInputStyle={'NotifiIntercomTelegramInput__input'}
          intercomView={true}
        />
      ) : null}
    </div>
  );
};
