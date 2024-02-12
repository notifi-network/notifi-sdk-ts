import { useNotifiSubscriptionContext } from '@notifi-network/notifi-react-card';
import Image from 'next/image';
import React from 'react';

import { Toggle } from './Toggle';

// import { TelegramIcon } from '../assets/TelegramIcon';

export type TelegramInputProps = Readonly<{
  disabled: boolean;
  hasChatAlert?: boolean;
}>;

export const TelegramInput: React.FC<TelegramInputProps> = ({
  disabled,
}: TelegramInputProps) => {
  const { useTelegram, setUseTelegram } = useNotifiSubscriptionContext();

  return (
    <>
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-dusk flex flex-col items-center justify-center">
          <Image
            src="/logos/telegram-icon.svg"
            alt="telegran-icon"
            width={16}
            height={16}
          />
          <text className="font-bold text-xs mt-2">Telegram</text>
        </div>
        <div className="flex flex-row items-center justify-between w-90 mr-4">
          <text className="font-semibold text-sm ml-6">Telegram Alerts</text>
          <Toggle
            disabled={disabled}
            checked={useTelegram}
            setChecked={setUseTelegram}
          />
        </div>
      </div>
    </>
  );
};
