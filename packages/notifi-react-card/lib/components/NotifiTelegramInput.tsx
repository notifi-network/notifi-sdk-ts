import clsx from 'clsx';
import React from 'react';

import { TelegramIcon } from '../assets/TelegramIcon';
import { useNotifiForm } from '../context';
import type { DeepPartialReadonly } from '../utils';

export type NotifiTelegramInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
    label: string;
    button: string;
    errorMessage: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  hasChatAlert?: boolean;
}>;

export const NotifiTelegramInput: React.FC<NotifiTelegramInputProps> = ({
  classNames,
  copy,
  disabled,
}: NotifiTelegramInputProps) => {
  const {
    formState,
    formErrorMessages,
    setTelegram,
    setTelegramErrorMessage,
    setHasChanges,
  } = useNotifiForm();

  const { telegram } = formState;

  const { telegram: telegramErrorMessage } = formErrorMessages;

  const validateTelegram = () => {
    if (telegram === '') {
      return;
    }

    const TelegramRegex =
      /^@?(?=\w{5,32}\b)[a-zA-Z0-9]+(?:[a-zA-Z0-9_ ]+[a-zA-Z0-9])*$/;

    if (TelegramRegex.test(telegram)) {
      setTelegramErrorMessage('');
    } else {
      setTelegramErrorMessage('The telegram is invalid. Please try again.');
    }
  };

  return (
    <>
      <label className={clsx('NotifiTelegramInput__label', classNames?.label)}>
        {copy?.label}
      </label>
      <div
        className={clsx(
          'NotifiTelegramInput__container',
          classNames?.container,
        )}
      >
        <TelegramIcon className={'NotifiInput__icon'} />
        <input
          data-cy="notifiTelegramInput"
          onBlur={validateTelegram}
          className={clsx('NotifiTelegramInput__input', classNames?.input)}
          disabled={disabled}
          name="notifi-telegram"
          type="text"
          value={telegram}
          onFocus={() => setTelegramErrorMessage('')}
          onChange={(e) => {
            setHasChanges(true);
            setTelegram(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Telegram ID'}
        />
      </div>
      <label
        className={clsx(
          'NotifiTelegramInput__errorMessage',
          classNames?.errorMessage,
        )}
      >
        {telegramErrorMessage}
      </label>
    </>
  );
};
