import { CardConfigItemV1 } from '@notifi-network/notifi-react-card';
import clsx from 'clsx';
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
import { SubscriptionCardUnsupported } from '../subscription/SubscriptionCardUnsupported';

export type FetchedStateCardProps = Readonly<{
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
  email: string;
  setEmail: (email: string) => void;
  emailErrorMessage: string;
  setEmailErrorMessage: (emailErrorMessage: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  smsErrorMessage: string;
  setSmsErrorMessage: (smsErrorMessage: string) => void;
  telegramId: string;
  setTelegramId: (telegram: string) => void;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export const FetchedStateCard: React.FC<FetchedStateCardProps> = ({
  data,
  inputSeparators,
  classNames,
  inputLabels,
  email,
  setEmail,
  emailErrorMessage,
  setEmailErrorMessage,
  phoneNumber,
  setPhoneNumber,
  setSmsErrorMessage,
  smsErrorMessage,
  telegramId,
  setTelegramId,
  checked,
  setChecked,
}) => {
  let contents: React.ReactNode = <SubscriptionCardUnsupported />;
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];
  // switch (card.data.hasStartedChatting) {
  //   case true:
  contents = (
    <div className={'NotifiSupportNotificationOption__container'}>
      <NotifiEmailInput
        email={email}
        setEmail={setEmail}
        emailErrorMessage={emailErrorMessage}
        setEmailErrorMessage={setEmailErrorMessage}
        disabled={false}
        classNames={classNames?.NotifiEmailInput}
        copy={{ label: inputLabels?.email }}
        intercomEmailInputStyle={'NotifiIntercomEmailInput__container'}
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
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        setSmsErrorMessage={setSmsErrorMessage}
        smsErrorMessage={smsErrorMessage}
        disabled={false}
        classNames={classNames?.NotifiSmsInput}
        allowedCountryCodes={allowedCountryCodes}
        copy={{ label: inputLabels?.sms }}
        intercomSmsInputStyle={'NotifiIntercomSmsInput__container'}
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
        telegramId={telegramId}
        setTelegramId={setTelegramId}
        disabled={false}
        classNames={classNames?.NotifiTelegramInput}
        copy={{ label: inputLabels?.telegram }}
        intercomTelegramInputStyle={'NotifiIntercomTelegramInput__container'}
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
  //     break;
  //   case false:
  //     contents = <></>;
  //     break;
  // }

  return <>{contents}</>;
};
