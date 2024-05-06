import { Icon } from '@/assets/Icon';
import { useNotifiTargetContext } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import React from 'react';

import { Toggle } from './Toggle';

export type InputFieldWalletProps = Readonly<{
  disabled: boolean;
  isEditable?: boolean;
}>;

export const InputFieldWallet: React.FC<InputFieldWalletProps> = ({
  disabled,
  isEditable,
}: InputFieldWalletProps) => {
  const {
    updateTargetInputs,
    renewToggleTargetGroup,
    targetDocument: {
      targetInputs: { email, telegram, wallet },
    },
  } = useNotifiTargetContext();

  const { selectedWallet } = useWallets();

  const isCoinbaseWallet = selectedWallet?.includes('coinbase');

  return (
    <>
      <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center mb-2 gap-3 sm:gap-0">
        <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon id="wallet-icon" className="text-notifi-tenant-brand-bg" />
          <div className="font-medium text-xs mt-2 text-notifi-grey-text">
            Wallet
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-2/3 sm:w-90 mr-4">
          <div className="text-sm sm:ml-6 text-notifi-text">Wallet Alerts</div>
          {isCoinbaseWallet ? (
            <Toggle
              disabled={disabled || !!telegram.error || !!email.error}
              checked={wallet}
              onChange={() => {
                updateTargetInputs('wallet', !wallet);
                if (isEditable) renewToggleTargetGroup('wallet', !wallet);
              }}
            />
          ) : (
            <div className="text-sm sm:ml-6 text-gray-500 text-end">
              <div>Only available for</div>
              <div>Coinbase Wallets</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
