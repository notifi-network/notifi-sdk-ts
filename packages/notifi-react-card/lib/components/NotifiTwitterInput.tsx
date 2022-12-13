import clsx from 'clsx';
import React from 'react';

import { TwitterIcon } from '../assets/TwitterIcon';
import { useNotifiForm } from '../context';
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
}>;

export const NotifiTwitterInput: React.FC<NotifiTwitterInputProps> = ({
  classNames,
  copy,
  disabled,
  intercomView,
  intercomTwitterInputContainerStyle,
  intercomTwitterInputStyle,
}: NotifiTwitterInputProps) => {
  const { formState, formErrorMessages, setTwitter, setTwitterErrorMessage } =
    useNotifiForm();

  const { twitter } = formState;

  const { twitter: twitterErrorMessage } = formErrorMessages;

  const validateTwitter = () => {
    if (twitter === '') {
      return;
    }

    const twitterRegex = new RegExp('^[a-zA-Z0-9_]{1,15}$');
    if (twitterRegex.test(twitter)) {
      setTwitterErrorMessage('');
    } else {
      setTwitterErrorMessage(
        'The twitter handle is invalid. Please try again.',
      );

      if (twitter.length > 15) {
        setTwitterErrorMessage(
          'This username is too long. Please use a shorter one',
        );
      }
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
        <TwitterIcon className={'NotifiInput__icon'} />
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
          value={twitter}
          onFocus={() => setTwitterErrorMessage('')}
          onChange={(e) => {
            setTwitter(e.target.value ?? '');
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
