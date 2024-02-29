import { Icon } from '@/assets/Icon';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import {
  DeepPartialReadonly,
  useNotifiForm,
} from '@notifi-network/notifi-react-card';
import React from 'react';

import { NotifiSignUpButton } from './NotifiSignUpButton';

export type EmailInputProps = Readonly<{
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  hasChatAlert?: boolean;
  isEdit?: boolean;
}>;

export const EmailInput: React.FC<EmailInputProps> = ({
  copy,
  disabled,
  isEdit,
}: EmailInputProps) => {
  const {
    formState,
    formErrorMessages,
    setEmail,
    setEmailErrorMessage,
    setHasEmailChanges,
    hasEmailChanges,
  } = useNotifiForm();

  const { cardConfig } = useNotifiCardContext();

  const { email } = formState;

  const { email: emailErrorMessage } = formErrorMessages;
  console.log('hasEmailChanges', hasEmailChanges);

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

  console.log('email', email);

  return (
    <>
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="email-icon"
            width="15px"
            height="12px"
            className="text-notifi-toggle-on-bg"
          />
          <div className="font-bold text-xs mt-2">Email</div>
        </div>
        <div className="relative">
          <input
            className="border border-grey-300 rounded-md w-86 h-11 mr-4 text-sm pl-3 focus:outline-none"
            data-cy="notifiEmailInput"
            onBlur={validateEmail}
            disabled={disabled}
            name="notifi-email"
            type="email"
            value={email}
            onFocus={() => setEmailErrorMessage('')}
            onChange={(e) => {
              setHasEmailChanges(true);
              setEmail(e.target.value ?? '');
            }}
            placeholder={copy?.placeholder ?? 'Enter your email address'}
          />
          {isEdit && hasEmailChanges ? (
            <NotifiSignUpButton
              buttonText="Save"
              data={cardConfig}
              isEdit={true}
              target="email"
            />
          ) : null}
        </div>
      </div>
      <label>{emailErrorMessage}</label>
    </>
  );
};
