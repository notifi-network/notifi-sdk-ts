import clsx from 'clsx';
import React from 'react';

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
}>;

export const NotifiTelegramInput: React.FC<NotifiTelegramInputProps> = ({
  classNames,
  copy,
  disabled,
  intercomTelegramInputStyle,
  intercomTelegramInputContainerStyle,
  intercomView,
}: NotifiTelegramInputProps) => {
  const { intercomCardView, telegramId, setTelegramId } =
    useNotifiSubscriptionContext();

  return (
    <>
      {intercomView ? (
        intercomCardView.state === 'settingView' ? (
          <div
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
