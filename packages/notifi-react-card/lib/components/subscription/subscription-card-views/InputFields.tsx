import clsx from 'clsx';
import React from 'react';

import { NotifiInputLabels, NotifiInputSeparators } from '..';
import { CardConfigItemV1 } from '../../../hooks';
import {
  NotifiDiscordInput,
  NotifiDiscordInputProps,
} from '../../NotifiDiscordInput';
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
  NotifiTwitterInput,
  NotifiTwitterInputProps,
} from '../../NotifiTwitterInput';

export type InputFieldsProps = {
  data: CardConfigItemV1;
  inputSeparators?: NotifiInputSeparators;
  inputLabels?: NotifiInputLabels;
  allowedCountryCodes: string[];
  inputDisabled: boolean;
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiDiscordInput?: NotifiDiscordInputProps['classNames'];
    NotifiTwitterInput?: NotifiTwitterInputProps['classNames'];
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
          disabled={inputDisabled}
          classNames={classNames?.NotifiTelegramInput}
          copy={{ label: inputLabels?.telegram }}
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
      {data.contactInfo.discord?.active ? (
        <NotifiDiscordInput
          disabled={inputDisabled}
          classNames={classNames?.NotifiSmsInput}
          copy={{ label: inputLabels?.discord }}
        />
      ) : null}
      {inputSeparators?.discordSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
            inputSeparators?.discordSeparator?.classNames?.container,
          )}
        >
          <div
            className={clsx(
              'NotifiInputSeparator__content',
              inputSeparators.discordSeparator.classNames?.content,
            )}
          >
            {inputSeparators?.discordSeparator?.content}
          </div>
        </div>
      ) : null}
      {data.contactInfo.twitter?.active ? (
        <NotifiTwitterInput
          disabled={inputDisabled}
          classNames={classNames?.NotifiTwitterInput}
          copy={{ label: inputLabels?.twitter }}
        />
      ) : null}
      {inputSeparators?.twitterSeparator?.content ? (
        <div
          className={clsx(
            'NotifiInputSeparator__container',
            inputSeparators?.twitterSeparator?.classNames?.container,
          )}
        >
          <div
            className={clsx(
              'NotifiInputSeparator__content',
              inputSeparators.twitterSeparator.classNames?.content,
            )}
          >
            {inputSeparators?.twitterSeparator?.content}
          </div>
        </div>
      ) : null}
    </>
  );
};
