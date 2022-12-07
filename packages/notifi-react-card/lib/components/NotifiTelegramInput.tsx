import clsx from 'clsx';
import React from 'react';

import { TelegramIcon } from '../assets/TelegramIcon';
import { useNotifiSubscriptionContext } from '../context';
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
  intercomTelegramInputStyle?: string;
  intercomTelegramInputContainerStyle?: string;
  intercomView?: boolean;
  hasChatAlert?: boolean;
  hideStartIcon?: boolean;
}>;

export const NotifiTelegramInput: React.FC<NotifiTelegramInputProps> = ({
  classNames,
  copy,
  disabled,
  intercomTelegramInputStyle,
  intercomTelegramInputContainerStyle,
  intercomView,
  hideStartIcon,
}: NotifiTelegramInputProps) => {
  const {
    telegramId,
    setTelegramId,
    telegramConfirmationUrl,
    setTelegramErrorMessage,
    telegramErrorMessage,
    intercomCardView,
  } = useNotifiSubscriptionContext();

  const validateTelegram = () => {
    if (telegramId === '') {
      return;
    }

    const TelegramRegex =
      /^@?(?=\w{5,32}\b)[a-zA-Z0-9]+(?:[a-zA-Z0-9_ ]+[a-zA-Z0-9])*$/;

    if (TelegramRegex.test(telegramId)) {
      setTelegramErrorMessage('');
    } else {
      setTelegramErrorMessage('The telegram is invalid. Please try again.');
    }
  };

  const handleClick = () => {
    window.open(telegramConfirmationUrl, '_blank');
  };

  return (
    <>
      {intercomView ? (
        intercomCardView.state === 'settingView' &&
        telegramConfirmationUrl != null ? (
          <div
            onClick={handleClick}
            className={clsx(
              'NotifiTelegramVerification__button',
              classNames?.button,
            )}
          >
            Verify ID
          </div>
        ) : null
      ) : (
        <label className={clsx('NotifiSmsInput__label', classNames?.label)}>
          {copy?.label}
        </label>
      )}
      <div
        className={clsx(
          'NotifiTelegramInput__container',
          intercomTelegramInputContainerStyle,
          classNames?.container,
        )}
      >
        {hideStartIcon ? null : (
          <TelegramIcon className={'NotifiInput__icon'} />
        )}
        <input
          onBlur={validateTelegram}
          className={clsx(
            'NotifiTelegramInput__input',
            intercomTelegramInputStyle,
            classNames?.input,
          )}
          disabled={disabled}
          name="notifi-telegram"
          type="text"
          value={telegramId}
          onFocus={() => setTelegramErrorMessage('')}
          onChange={(e) => {
            setTelegramId(e.target.value ?? '');
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
