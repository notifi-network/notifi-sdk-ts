import { Icon } from '@/assets/Icon';
import { useNotifiTargetContext } from '@notifi-network/notifi-react';
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
  const {
    updateTargetInputs,
    renewTargetGroup,
    targetDocument: {
      targetInputs: { email, telegram, discord },
    },
  } = useNotifiTargetContext();

  return (
    <div className="bg-notifi-destination-card-bg rounded-lg w-full sm:w-112 h-18 flex flex-row items-center mb-2 gap-3 sm:gap-0 shadow-destinationCard">
      <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
        <Icon
          id="discord-icon"
          width="17px"
          height="13px"
          className="text-notifi-button-primary-text"
        />
        <div className="font-medium text-xs mt-2 text-notifi-text-light">
          Discord
        </div>
      </div>
      <div className="flex flex-row items-center justify-between w-2/3 sm:w-90 mr-4">
        <div className="text-sm sm:ml-6 text-notifi-text">
          Discord Bot DM Alerts
        </div>
        <Toggle
          disabled={disabled || !!telegram.error || !!email.error}
          checked={discord}
          onChange={() => {
            updateTargetInputs('discord', !discord);
            if (isEditable)
              renewTargetGroup({ target: 'discord', value: !discord });
          }}
        />
      </div>
    </div>
  );
};
