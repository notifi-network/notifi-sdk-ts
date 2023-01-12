import clsx from 'clsx';
import React from 'react';

import { EmailIcon } from '../assets/EmailIcon';
import { useNotifiForm, useNotifiSubscriptionContext } from '../context';
import { useNotifiSubscribe } from '../hooks';
import type { DeepPartialReadonly } from '../utils';

export type NotifiEmailInputProps = Readonly<{
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
  intercomEmailInputStyle?: string;
  intercomEmailInputContainerStyle?: string;
  intercomView?: boolean;
  hasChatAlert?: boolean;
}>;

export const NotifiEmailInput: React.FC<NotifiEmailInputProps> = ({
  classNames,
  copy,
  disabled,
  intercomEmailInputStyle,
  intercomEmailInputContainerStyle,
  intercomView,
}: NotifiEmailInputProps) => {
  const { emailIdThatNeedsConfirmation, intercomCardView } =
    useNotifiSubscriptionContext();

  const {
    formState,
    formErrorMessages,
    setEmail,
    setEmailErrorMessage,
    setHasChanges,
  } = useNotifiForm();

  const { email } = formState;

  const { email: emailErrorMessage } = formErrorMessages;

  const { resendEmailVerificationLink } = useNotifiSubscribe({
    targetGroupName: 'Intercom',
  });

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

  const handleClick = () => {
    resendEmailVerificationLink();
  };

  return (
    <>
      {intercomView ? (
        intercomCardView.state === 'settingView' &&
        emailIdThatNeedsConfirmation != '' ? (
          <div
            onClick={handleClick}
            className={clsx(
              'NotifiEmailVerification__button',
              classNames?.button,
            )}
          >
            Resend Verification
          </div>
        ) : null
      ) : (
        <label className={clsx('NotifiEmailInput__label', classNames?.label)}>
          {copy?.label}
        </label>
      )}
      <div
        className={clsx(
          'NotifiEmailInput__container',
          intercomEmailInputContainerStyle,
          classNames?.container,
        )}
      >
        <EmailIcon className={'NotifiInput__icon'} />
        <input
          onBlur={validateEmail}
          className={clsx(
            'NotifiEmailInput__input',
            intercomEmailInputStyle,
            classNames?.input,
          )}
          disabled={disabled}
          name="notifi-email"
          type="email"
          value={email}
          onFocus={() => setEmailErrorMessage('')}
          onChange={(e) => {
            setHasChanges(true);
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
