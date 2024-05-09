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
    renewTargetGroup,
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
          <div className="flex items-center gap-1.5 text-sm sm:ml-6 text-notifi-text">
            Wallet Alerts
            <button className="relative group flex items-center justify-center">
              <Icon id="info" className="text-notifi-text-light" />

              <div className="w-[194px] bg-black text-white text-start border border-gray-500 text-sm font-medium rounded-md p-4 absolute z-10 hidden bottom-full inset-x-1/2 group-hover:block transition-all duration-300 ease-in-out">
                Wallet messages are powered by XMTP and delivered natively into
                Coinbase Wallet. Download the Coinbase Wallet App or Browser
                Extension to receive wallet alerts!
              </div>
            </button>
          </div>
          {isCoinbaseWallet ? (
            <Toggle
              disabled={disabled || !!telegram.error || !!email.error}
              checked={wallet}
              onChange={() => {
                updateTargetInputs('wallet', !wallet);
                if (isEditable)
                  renewTargetGroup({ target: 'wallet', value: !wallet });
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
