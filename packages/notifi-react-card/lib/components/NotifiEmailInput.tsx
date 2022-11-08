import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import type { DeepPartialReadonly } from '../utils';

export type NotifiEmailInputProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    input: string;
    label: string;
    errorMessage: string;
  }>;
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  intercomEmailInputStyle?: string;
}>;

export const NotifiEmailInput: React.FC<NotifiEmailInputProps> = ({
  classNames,
  copy,
  disabled,
  intercomEmailInputStyle,
}: NotifiEmailInputProps) => {
  const { email, setEmail, setEmailErrorMessage, emailErrorMessage } =
    useNotifiSubscriptionContext();

  const validateEmail = () => {
    if (email === '') {
      return;
    }

    const emailRegex = new RegExp(
      '^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$',
    );
    if (emailRegex.test(email)) {
      setEmailErrorMessage('');
    } else {
      setEmailErrorMessage('The email is invalid. Please try again.');
    }
  };

  return (
    <>
      <label className={clsx('NotifiEmailInput__label', classNames?.label)}>
        {copy?.label}
      </label>
      <div
        className={clsx(
          'NotifiEmailInput__container',
          intercomEmailInputStyle,
          classNames?.container,
        )}
      >
        <input
          onBlur={validateEmail}
          className={clsx('NotifiEmailInput__input', classNames?.input)}
          disabled={disabled}
          name="notifi-email"
          type="email"
          value={email}
          onFocus={() => setEmailErrorMessage('')}
          onChange={(e) => {
            setEmail(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Email Address'}
        />
      </div>
      <label
        className={clsx(
          'NotifiEmailInput__errorMessage',
          classNames?.errorMessage,
        )}
      >
        {emailErrorMessage}
      </label>
    </>
  );
};
