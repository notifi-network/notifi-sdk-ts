import { Icon } from '@/assets/Icon';
import {
  DeepPartialReadonly,
  useNotifiForm,
} from '@notifi-network/notifi-react-card';
import React from 'react';

// import { EmailIcon } from '../assets/EmailIcon';

export type EmailInputProps = Readonly<{
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  hasChatAlert?: boolean;
}>;

export const EmailInput: React.FC<EmailInputProps> = ({
  copy,
  disabled,
}: EmailInputProps) => {
  const {
    formState,
    formErrorMessages,
    setEmail,
    setEmailErrorMessage,
    setHasChanges,
  } = useNotifiForm();

  const { email } = formState;

  const { email: emailErrorMessage } = formErrorMessages;

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
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
          {/* <Image
            src="/logos/email-icon.svg"
            alt="email-icon"
            width={15}
            height={12}
          /> */}
          <Icon
            id="email-icon"
            width="15px"
            height="12px"
            className="text-notifi-toggle-on-bg"
          />
          <text className="font-bold text-xs mt-2">Email</text>
        </div>
        <input
          className="border border-grey-300 rounded-md w-86 h-11 mr-4 text-sm pl-3"
          data-cy="notifiEmailInput"
          onBlur={validateEmail}
          disabled={disabled}
          name="notifi-email"
          type="email"
          value={email}
          onFocus={() => setEmailErrorMessage('')}
          onChange={(e) => {
            setHasChanges(true);
            setEmail(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Enter your email address'}
        />
      </div>
      <label>{emailErrorMessage}</label>
    </>
  );
};
