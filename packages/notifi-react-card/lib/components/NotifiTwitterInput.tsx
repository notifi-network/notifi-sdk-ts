import clsx from 'clsx';
import React from 'react';

import { TwitterIcon } from '../assets/TwitterIcon';
import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';

export type NotifiTwitterInputProps = Readonly<{
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
  disabled: boolean;
  intercomView?: boolean;
  intercomTwitterInputStyle?: string;
  intercomTwitterInputContainerStyle?: string;
  hideStartIcon?: boolean;
}>;

export const NotifiTwitterInput: React.FC<NotifiTwitterInputProps> = ({
  classNames,
  copy,
  disabled,
  hideStartIcon,
  intercomView,
  intercomTwitterInputContainerStyle,
  intercomTwitterInputStyle,
}: NotifiTwitterInputProps) => {
  const {
    twitterId,
    setTwitterId,
    setTwitterErrorMessage,
    twitterErrorMessage,
  } = useNotifiSubscriptionContext();

  const validateTwitter = () => {
    if (twitterId === '') {
      return;
    }

    const twitterRegex = new RegExp('^@?(w){1,15}$');
    if (twitterRegex.test(twitterId)) {
      setTwitterErrorMessage('');
    } else {
      setTwitterErrorMessage(
        'The twitter handle is invalid. Please try again.',
      );
    }
  };

  return (
    <>
      {intercomView ? null : (
        <label className={clsx('NotifiTwitterInput__label', classNames?.label)}>
          {copy?.label}
        </label>
      )}
      <div
        className={clsx(
          'NotifiTwitterInput__container',
          intercomTwitterInputContainerStyle,
          classNames?.container,
        )}
      >
        {hideStartIcon ? null : <TwitterIcon className={'NotifiInput__icon'} />}
        <input
          onBlur={validateTwitter}
          className={clsx(
            'NotifiTwitterInput__input',
            intercomTwitterInputStyle,
            classNames?.input,
          )}
          disabled={disabled}
          name="notifi-twitter"
          type="twitter"
          value={twitterId}
          onFocus={() => setTwitterErrorMessage('')}
          onChange={(e) => {
            setTwitterId(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Twitter'}
        />
      </div>
      <label
        className={clsx(
          'NotifiTwitterInput__errorMessage',
          classNames?.errorMessage,
        )}
      >
        {twitterErrorMessage}
      </label>
    </>
  );
};
