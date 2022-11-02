import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React from 'react';

import { CardConfigItemV1 } from '../../../hooks';
import {
  NotifiEmailInput,
  NotifiEmailInputProps,
} from '../../NotifiEmailInput';
import { NotifiSmsInput, NotifiSmsInputProps } from '../../NotifiSmsInput';
import {
  NotifiTelegramInput,
  NotifiTelegramInputProps,
} from '../../NotifiTelegramInput';
import {
  NotifiSubscribeButton,
  NotifiSubscribeButtonProps,
} from '../NotifiSubscribeButton';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from '../NotifiSubscriptionCard';

export type EditCardViewProps = Readonly<{
  data: CardConfigItemV1;
  inputDisabled: boolean;
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiSmsInput?: NotifiSmsInputProps['classNames'];
    NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
  }>;
  inputSeparators?: NotifiInputSeparators;
  inputLabels?: NotifiInputLabels;
  allowedCountryCodes: string[];
}>;

export const EditCardView: React.FC<EditCardViewProps> = ({
  data,
  inputDisabled,
  classNames,
  inputSeparators,
  inputLabels,
  allowedCountryCodes,
}) => {
  const {
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
  } = useNotifiSubscriptionContext();
  return (
    <>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput
          email={email}
          setEmail={setEmail}
          emailErrorMessage={emailErrorMessage}
          setEmailErrorMessage={setEmailErrorMessage}
          disabled={inputDisabled}
          classNames={classNames?.NotifiEmailInput}
          copy={{ label: inputLabels?.email }}
        />
      ) : null}
      {inputSeparators?.emailSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
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
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setSmsErrorMessage={setSmsErrorMessage}
          smsErrorMessage={smsErrorMessage}
          disabled={inputDisabled}
          classNames={classNames?.NotifiSmsInput}
          allowedCountryCodes={allowedCountryCodes}
          copy={{ label: inputLabels?.sms }}
        />
      ) : null}
      {inputSeparators?.smsSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
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
          telegramId={telegramId}
          setTelegramId={setTelegramId}
          disabled={inputDisabled}
          classNames={classNames?.NotifiTelegramInput}
          copy={{ label: inputLabels?.telegram }}
        />
      ) : null}
      {inputSeparators?.telegramSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
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
      <NotifiSubscribeButton
        data={data}
        classNames={classNames?.NotifiSubscribeButton}
      />
    </>
  );
};
