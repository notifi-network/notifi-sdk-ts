import {
  DeepPartialReadonly,
  useNotifiForm,
} from '@notifi-network/notifi-react-card';
import Image from 'next/image';
import React from 'react';

// import { EmailIcon } from '../assets/EmailIcon';

export type SlackInputProps = Readonly<{
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
}>;

export const SlackInput: React.FC<SlackInputProps> = ({
  copy,
  disabled,
}: SlackInputProps) => {
  const { setEmail, setEmailErrorMessage } = useNotifiForm();

  // const { slack } = formState;

  // const { slack: slackErrorMessage } = formErrorMessages;

  const validateSlack = () => {
    // if (slack === '') {
    //   return;
    // }
    // const emailRegex = new RegExp(
    //   '^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$',
    // );
    // if (emailRegex.test(slack)) {
    //   setEmailErrorMessage('');
    // } else {
    //   setEmailErrorMessage('The email is invalid. Please try again.');
    // }
  };

  return (
    <>
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-dusk flex flex-col items-center justify-center">
          <Image
            src="/logos/slack-icon.svg"
            alt="slack-icon"
            width={16}
            height={16}
          />
          <text className="font-bold text-xs mt-2">Slack</text>
        </div>
        <input
          className="border border-grey-300 rounded-md w-86 h-11 mr-4 text-sm pl-3"
          data-cy="notifiEmailInput"
          onBlur={validateSlack}
          disabled={disabled}
          name="notifi-email"
          type="email"
          value={''}
          onFocus={() => setEmailErrorMessage('')}
          onChange={(e) => {
            setEmail(e.target.value ?? '');
          }}
          placeholder={copy?.placeholder ?? 'Enter your Slack email address'}
        />
      </div>
    </>
  );
};
