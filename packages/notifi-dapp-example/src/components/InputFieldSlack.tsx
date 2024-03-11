import { Icon } from '@/assets/Icon';
import { useNotifiTargets } from '@/hooks/useNotifiTargets';
import {
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React from 'react';

import { Toggle } from './Toggle';

export type InputFieldSlackProps = Readonly<{
  disabled: boolean;
  isEditable?: boolean;
}>;

export const InputFieldSlack: React.FC<InputFieldSlackProps> = ({
  disabled,
  isEditable,
}: InputFieldSlackProps) => {
  const { formErrorMessages } = useNotifiForm();
  const { email: emailErrorMessage, telegram: telegramErrorMessage } =
    formErrorMessages;
  const { updateTarget } = useNotifiTargets('slack');
  const { useSlack, setUseSlack, slackTargetData } =
    useNotifiSubscriptionContext();

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
        <div className="flex flex-row items-center justify-between w-90 mr-4">
          <div className="flex flex-col items-start">
            <div className="text-sm ml-6">
              {' '}
              {slackTargetData?.slackChannelName ?? 'Slack'}
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                window.open(slackTargetData?.verificationLink, '_blank');
              }}
              className="text-xs font-semibold 
text-notifi-button-primary-blueish-bg ml-6 mt-1"
            >
              <label className="cursor-pointer">Change Workspace/Channel</label>
            </a>
          </div>
          <Toggle
            disabled={
              disabled ||
              telegramErrorMessage !== '' ||
              emailErrorMessage !== ''
            }
            checked={useSlack}
            onChange={() => {
              isEditable ? updateTarget() : setUseSlack(!useSlack);
            }}
          />
        </div>
      </div>
    </>
  );
};
