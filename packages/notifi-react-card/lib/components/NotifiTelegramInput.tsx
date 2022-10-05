import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';

export type NotifiTelegramInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
    label: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
}>;

export const NotifiTelegramInput: React.FC<NotifiTelegramInputProps> = ({
  classNames,
  copy,
  disabled,
}: NotifiTelegramInputProps) => {
  const { telegramId, setTelegramId } = useNotifiSubscriptionContext();

  return (
    <>
      <label className={clsx('NotifiSmsInput__label', classNames?.label)}>
        {copy?.label}
      </label>
      <div
        className={clsx(
          'NotifiTelegramInput__container',
          classNames?.container,
        )}
      >
        <input
          className={clsx('NotifiTelegramInput__input', classNames?.input)}
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
