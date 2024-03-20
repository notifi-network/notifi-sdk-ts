import { Icon } from '@/assets/Icon';
import { useNotifiTargets } from '@/hooks/useNotifiTargets';
import {
  DeepPartialReadonly,
  useNotifiForm,
} from '@notifi-network/notifi-react-card';
import React from 'react';

export type InputFieldEmailProps = Readonly<{
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  hasChatAlert?: boolean;
  isEditable?: boolean;
}>;

export const InputFieldEmail: React.FC<InputFieldEmailProps> = ({
  copy,
  disabled,
  isEditable,
}: InputFieldEmailProps) => {
  const { formState, formErrorMessages, setEmail, setEmailErrorMessage } =
    useNotifiForm();

  const { email: emailErrorMessage, telegram: telegramErrorMessage } =
    formErrorMessages;
  const { updateTarget, setHasEmailChanges, hasEmailChanges } =
    useNotifiTargets('email');

  const { email } = formState;

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

  const hasErrors = emailErrorMessage !== '';

  return (
    <div className="bg-notifi-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center mb-2 gap-2 sm:gap-4">
      <div className="bg-white rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
        <Icon
          id="email-icon"
          width="15px"
          height="12px"
          className="text-notifi-button-primary-blueish-bg"
        />
        <div className="font-medium text-xs mt-2">Email</div>
      </div>
      <div className="relative w-3/4">
        <input
          className={`border rounded-md w-full sm:w-86 h-11 mr-4 text-sm pl-3 focus:outline-none ${
            hasErrors ? 'border-notifi-error' : 'border-gray-300'
          } flex ${hasErrors ? 'pt-3' : 'pt-0'}`}
          data-cy="notifiEmailInput"
          onBlur={validateEmail}
          disabled={disabled}
          onFocus={() => setEmailErrorMessage('')}
          name="notifi-email"
          type="email"
          value={email}
          onChange={(e) => {
            setHasEmailChanges(true);
            setEmail(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Enter your email address'}
        />
        {hasErrors ? (
          <div className="absolute top-[5px] left-[11px] flex flex-col items-start">
            <p className="text-notifi-error text-xs block">
              {emailErrorMessage}
            </p>
          </div>
        ) : null}
        {isEditable && hasEmailChanges ? (
          <button
            className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-16 h-7 mb-6 text-sm font-medium absolute top-2.5 right-1 disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
            disabled={telegramErrorMessage !== '' || emailErrorMessage !== ''}
            onClick={updateTarget}
          >
            <span>Save</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
