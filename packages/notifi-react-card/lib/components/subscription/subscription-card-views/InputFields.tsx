import clsx from 'clsx';
import React from 'react';

import { NotifiInputFieldsText, NotifiInputSeparators } from '..';
import { useNotifiClientContext } from '../../../context';
import { CardConfigItemV1 } from '../../../hooks';
import {
  NotifiEmailInput,
  NotifiEmailInputProps,
} from '../../NotifiEmailInput';
import {
  NotifiHwWalletToggle,
  NotifiHwWalletToggleProps,
} from '../../NotifiHwWalletToggle';
import { NotifiSmsInput, NotifiSmsInputProps } from '../../NotifiSmsInput';
import {
  NotifiTelegramInput,
  NotifiTelegramInputProps,
} from '../../NotifiTelegramInput';

export type InputFieldsProps = {
  data: CardConfigItemV1;
  inputSeparators?: NotifiInputSeparators;
  inputTextFields?: NotifiInputFieldsText;
  allowedCountryCodes: string[];
  inputDisabled: boolean;
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiSmsInput?: NotifiSmsInputProps['classNames'];
    NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
    NotifiHwWalletToggle?: NotifiHwWalletToggleProps['classNames'];
  }>;
};
export const InputFields: React.FC<InputFieldsProps> = ({
  data,
  classNames,
  inputSeparators,
  inputTextFields,
  allowedCountryCodes,
  inputDisabled,
}) => {
  const { params } = useNotifiClientContext();

  return (
    <>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput
          disabled={inputDisabled}
          classNames={classNames?.NotifiEmailInput}
          copy={{
            label: inputTextFields?.label?.email,
            placeholder: inputTextFields?.placeholderText?.email,
          }}
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
          disabled={inputDisabled}
          classNames={classNames?.NotifiSmsInput}
          allowedCountryCodes={allowedCountryCodes}
          copy={{
            label: inputTextFields?.label?.sms,
            placeholder: inputTextFields?.placeholderText?.sms,
          }}
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
          disabled={inputDisabled}
          classNames={classNames?.NotifiTelegramInput}
          copy={{
            label: inputTextFields?.label?.telegram,
            placeholder: inputTextFields?.placeholderText?.telegram,
          }}
        />
      ) : null}
      {inputSeparators?.telegramSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
            inputSeparators?.telegramSeparator?.classNames?.container,
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
      {/* TODO: param could be undefined when it comes to demoPreview. But now type not check */}
      {params?.walletBlockchain === 'SOLANA' ? (
        <NotifiHwWalletToggle
          disabled={inputDisabled}
          classNames={classNames?.NotifiHwWalletToggle}
        />
      ) : null}
    </>
  );
};
