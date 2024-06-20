'use client';

import { Icon } from '@/assets/Icon';
import { isEVMChain } from '@/utils/typeUtils';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import React, { useState } from 'react';

export default function Disconnect() {
  const { wallets, selectedWallet } = useWallets();
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState<boolean>(false);

  const keys = selectedWallet && wallets[selectedWallet].walletKeys;
  const accountAddress = keys
    ? isEVMChain(keys)
      ? keys.hex?.toLowerCase()
      : keys.bech32
    : '';

  if (!accountAddress) return null;

  return (
    <>
      {isWalletMenuOpen ? (
        <div
          className={`fixed z-10 inset-0`}
          onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
        />
      ) : null}

      <div className={`relative z-20 overflow-hidden`}>
        <div
          className={`cursor-pointer flex gap-x-5 px-4 text-notifi-tab-unselected-text w-56 py-2 ${
            isWalletMenuOpen ? 'border border-notifi-input-border ' : ''
          } 
              `}
          onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
        >
          <Icon
            id={'user-protrait'}
            className={`text-notifi-icon-unselected mt-[0.125rem]`}
          />
          <div>
            {accountAddress.slice(0, 6)} ... {accountAddress.slice(-6)}
          </div>
        </div>

        {isWalletMenuOpen ? (
          <div
            className={`cursor-pointer flex gap-x-5 px-4 text-notifi-tab-unselected-text w-56 py-2 border border-notifi-input-border border-t-transparent`}
            onClick={() => {
              if (keys) wallets[selectedWallet].disconnect();
            }}
          >
            <Icon id={'leave'} className={`text-notifi-icon-unselected`} />
            <div>Disconnect</div>
          </div>
        ) : null}
      </div>
    </>
  );
}
