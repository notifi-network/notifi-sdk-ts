import { Icon } from '@/assets/Icon';
import { useNotifiTargetContext } from '@notifi-network/notifi-react';
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
  const {
    updateTargetInputs,
    renewTargetGroup,
    targetDocument: {
      targetData,
      targetInputs: { email, telegram },
    },
  } = useNotifiTargetContext();

  return (
    <>
      <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center mb-2 gap-3 sm:gap-0">
        <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="slack-icon"
            width="16px"
            height="16px"
            className="text-notifi-tenant-brand-bg"
          />
          <div className="font-medium text-xs mt-2 text-notifi-grey-text">
            Slack
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-2/3 sm:w-90 mr-4 ">
          <div className="flex flex-col items-start">
            <div className="text-sm sm:ml-6 text-notifi-text">
              {targetData.slack.data?.slackChannelName
                ? targetData.slack.data?.slackChannelName
                : 'Slack'}
            </div>
            {targetData.slack.data?.slackChannelName ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.open(
                    targetData.slack.data?.webhookVerificationLink,
                    '_blank',
                  );
                }}
                className="text-xs font-semibold 
text-notifi-button-primary-blueish-bg md:ml-6 mt-1"
              >
                <label className="cursor-pointer text-notifi-toggle-on-bg">
                  Change Workspace/Channel
                </label>
              </a>
            ) : null}
          </div>
          <Toggle
            disabled={disabled || !!telegram.error || !!email.error}
            checked={targetData.slack.useSlack}
            onChange={() => {
              isEditable
                ? renewTargetGroup()
                : updateTargetInputs('slack', !targetData.slack.useSlack);
            }}
          />
        </div>
      </div>
    </>
  );
};
