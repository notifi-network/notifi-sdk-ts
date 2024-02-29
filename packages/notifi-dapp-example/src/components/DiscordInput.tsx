import { Icon } from '@/assets/Icon';
import { useNotifiSubscriptionContext } from '@notifi-network/notifi-react-card';
import React from 'react';

import { Toggle } from './Toggle';

export type DiscordInputProps = Readonly<{
  disabled: boolean;
}>;

export const DiscordInput: React.FC<DiscordInputProps> = ({ disabled }) => {
  const { useDiscord, setUseDiscord } = useNotifiSubscriptionContext();

  return (
    <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
      <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
        <Icon
          id="discord-icon"
          width="17px"
          height="13px"
          className="text-notifi-toggle-on-bg"
        />
        <div className="font-bold text-xs mt-2">Discord</div>
      </div>
      <div className="flex flex-row items-center justify-between w-90 mr-4">
        <div className="font-semibold text-sm ml-6">Discord Bot DM Alerts</div>
        <Toggle
          disabled={disabled}
          checked={useDiscord}
          onChange={() => setUseDiscord(!useDiscord)}
        />
      </div>
    </div>
  );
};
