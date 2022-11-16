import clsx from 'clsx';
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
    container?: string;
    inputsSection?: string;
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
  const emailInputActive = data.contactInfo.email.active;
  const smsInputActive = data.contactInfo.sms.active;
  const telegramInputActive = data.contactInfo.telegram.active;

  return (
    <div className={clsx('NotifiEditCard__container', classNames?.container)}>
      <div
        className={clsx(
          'NotifiEditCard__inputsSection',
          classNames?.inputsSection,
        )}
      >
        {emailInputActive ? (
          <NotifiEmailInput
            disabled={inputDisabled}
            classNames={classNames?.NotifiEmailInput}
            copy={{ label: inputLabels?.email }}
          />
        ) : null}
        {smsInputActive && inputSeparators?.emailSeparator?.content ? (
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
        {smsInputActive ? (
          <NotifiSmsInput
            disabled={inputDisabled}
            classNames={classNames?.NotifiSmsInput}
            allowedCountryCodes={allowedCountryCodes}
            copy={{ label: inputLabels?.sms }}
          />
        ) : null}
        {telegramInputActive && inputSeparators?.smsSeparator?.content ? (
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
        {telegramInputActive ? (
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
      </div>
      <NotifiSubscribeButton
        data={data}
        classNames={classNames?.NotifiSubscribeButton}
      />
    </div>
  );
};
