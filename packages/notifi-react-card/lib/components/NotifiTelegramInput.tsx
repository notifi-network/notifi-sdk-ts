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
}>;

export const NotifiTelegramInput: React.FC<NotifiTelegramInputProps> = ({
  classNames,
  copy,
  disabled,
  intercomTelegramInputStyle,
  intercomTelegramInputContainerStyle,
  intercomView,
  hasChatAlert = false,
}: NotifiTelegramInputProps) => {
  const { telegramId, setTelegramId, telegramConfirmationUrl } =
    useNotifiSubscriptionContext();

  const handleClick = () => {
    if (telegramConfirmationUrl != null) {
      window.open(telegramConfirmationUrl, '_blank');
    }
  };

  return (
    <>
      {intercomView ? (
        hasChatAlert && telegramId && telegramConfirmationUrl != null ? (
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
        <TelegramIcon className={'NotifiInput__icon'} />
        <input
          className={clsx(
            'NotifiTelegramInput__input',
            intercomTelegramInputStyle,
            classNames?.input,
          )}
          disabled={disabled}
          name="notifi-telegram"
          type="text"
          value={telegramId}
          onChange={(e) => {
            setTelegramId(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Telegram ID'}
        />
      </div>
    </>
  );
};
