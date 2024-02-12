import { useNotifiSubscriptionContext } from '@notifi-network/notifi-react-card';
import Image from 'next/image';
import React from 'react';

import { Toggle } from './Toggle';

export type DiscordInputProps = Readonly<{
  disabled: boolean;
}>;

export const DiscordInput: React.FC<DiscordInputProps> = ({ disabled }) => {
  const { useDiscord } = useNotifiSubscriptionContext();

  return (
    <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
      <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
        <Image
          src="/logos/discord-icon.svg"
          alt="discord-icon"
          width={17}
          height={13}
        />
        <text className="font-bold text-xs mt-2">Discord</text>
      </div>
      <div className="flex flex-row items-center justify-between w-90 mr-4">
        <text className="font-semibold text-sm ml-6">
          Discord Bot DM Alerts
        </text>
        <Toggle disabled={disabled} checked={useDiscord} />
      </div>
    </div>
  );
};
