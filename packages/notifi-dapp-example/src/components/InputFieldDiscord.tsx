import { Icon } from '@/assets/Icon';
import { useNotifiTargets } from '@/hooks/useNotifiTargets';
import {
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React from 'react';

import { Toggle } from './Toggle';

export type InputFieldDiscordProps = Readonly<{
  disabled: boolean;
  isEditable?: boolean;
}>;

export const InputFieldDiscord: React.FC<InputFieldDiscordProps> = ({
  disabled,
  isEditable,
}) => {
  const { formErrorMessages } = useNotifiForm();

  const { email: emailErrorMessage, telegram: telegramErrorMessage } =
    formErrorMessages;
  const { useDiscord, setUseDiscord } = useNotifiSubscriptionContext();
  const { updateTarget } = useNotifiTargets('discord');

  return (
    <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
      <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
        <Icon
          id="discord-icon"
          width="17px"
          height="13px"
          className="text-notifi-button-primary-blueish-bg"
        />
        <div className="font-medium text-xs mt-2">Discord</div>
      </div>
      <div className="flex flex-row items-center justify-between w-90 mr-4">
        <div className="text-sm ml-6">Discord Bot DM Alerts</div>
        <Toggle
          disabled={
            disabled || telegramErrorMessage !== '' || emailErrorMessage !== ''
          }
          checked={useDiscord}
          onChange={() => {
            isEditable ? updateTarget() : setUseDiscord(!useDiscord);
          }}
        />
      </div>
    </div>
  );
};
