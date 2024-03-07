import { Icon } from '@/assets/Icon';
import {
  DeepPartialReadonly,
  useNotifiForm,
} from '@notifi-network/notifi-react-card';
import React from 'react';

// import { EmailIcon } from '../assets/EmailIcon';

export type InputFieldSlackProps = Readonly<{
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
}>;

export const InputFieldSlack: React.FC<InputFieldSlackProps> = ({
  copy,
  disabled,
}: InputFieldSlackProps) => {
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
        <div className="bg-white rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="slack-icon"
            width="16px"
            height="16px"
            className="text-notifi-button-primary-blueish-bg"
          />
          <div className="font-medium text-xs mt-2">Slack</div>
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
