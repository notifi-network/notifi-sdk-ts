import clsx from 'clsx';
import React from 'react';

import { NotifiInputFieldsText, NotifiInputSeparators } from '..';
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

export type InputFieldsProps = {
  data: CardConfigItemV1;
  inputSeparators?: NotifiInputSeparators;
  inputLabels?: NotifiInputFieldsText;
  allowedCountryCodes: string[];
  inputDisabled: boolean;
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiSmsInput?: NotifiSmsInputProps['classNames'];
    NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
  }>;
};
export const InputFields: React.FC<InputFieldsProps> = ({
  data,
  classNames,
  inputSeparators,
  inputLabels,
  allowedCountryCodes,
  inputDisabled,
}) => {
  return (
    <>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput
          disabled={inputDisabled}
          classNames={classNames?.NotifiEmailInput}
          copy={{
            label: inputLabels?.input?.email,
            placeholder: inputLabels?.placeholder?.email,
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
            label: inputLabels?.input?.sms,
            placeholder: inputLabels?.placeholder?.sms,
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
            label: inputLabels?.input?.telegram,
            placeholder: inputLabels?.placeholder?.telegram,
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
    </>
  );
};
