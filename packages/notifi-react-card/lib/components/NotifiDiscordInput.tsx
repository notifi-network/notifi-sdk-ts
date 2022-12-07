import clsx from 'clsx';
import React from 'react';

import { DiscordIcon } from '../assets/DiscordIcon';
import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';

export type NotifiDiscordInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
    label: string;
    errorMessage: string;
    button: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  intercomView?: boolean;
  disabled: boolean;
  intercomDiscordInputStyle?: string;
  intercomDiscordInputContainerStyle?: string;
  hideStartIcon?: boolean;
}>;

export const NotifiDiscordInput: React.FC<NotifiDiscordInputProps> = ({
  classNames,
  copy,
  disabled,
  hideStartIcon,
  intercomView,
  intercomDiscordInputContainerStyle,
  intercomDiscordInputStyle,
}: NotifiDiscordInputProps) => {
  const {
    discordId,
    setDiscordId,
    setDiscordErrorMessage,
    discordErrorMessage,
  } = useNotifiSubscriptionContext();

  const validateDiscord = () => {
    if (discordId === '') {
      return;
    }

    const discordRegex = new RegExp('^@?(w){1,15}$');
    if (discordRegex.test(discordId)) {
      setDiscordErrorMessage('');
    } else {
      setDiscordErrorMessage(
        'The discord username is invalid. Please try again.',
      );
    }
  };

  return (
    <>
      {intercomView ? null : (
        <label className={clsx('NotifiDiscordInput__label', classNames?.label)}>
          {copy?.label}
        </label>
      )}
      <div
        className={clsx(
          'NotifiDiscordInput__container',
          intercomDiscordInputContainerStyle,
          classNames?.container,
        )}
      >
        {hideStartIcon ? null : <DiscordIcon className={'NotifiInput__icon'} />}
        <input
          onBlur={validateDiscord}
          className={clsx(
            'NotifiDiscordInput__input',
            intercomDiscordInputStyle,
            classNames?.input,
          )}
          disabled={disabled}
          name="notifi-discord"
          type="discord"
          value={discordId}
          onFocus={() => setDiscordErrorMessage('')}
          onChange={(e) => {
            setDiscordId(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Discord'}
        />
      </div>
      <label
        className={clsx(
          'NotifiDiscordInput__errorMessage',
          classNames?.errorMessage,
        )}
      >
        {discordErrorMessage}
      </label>
    </>
  );
};
