'use client';

import { Icon } from '@/assets/Icon';
import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import { isEVMChain } from '@/utils/typeUtils';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function NotifiSingupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallets, selectedWallet } = useWallets();
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!selectedWallet || !wallets[selectedWallet].walletKeys) {
      router.push('/');
    }
  }, [selectedWallet]);

  const keys = selectedWallet && wallets[selectedWallet].walletKeys;
  const accountAddress = keys
    ? isEVMChain(keys)
      ? keys.hex?.toLowerCase()
      : keys.bech32
    : '';

  const showDisconnectButton =
    ['notifi/ftu', 'notifi/signup'].includes(pathname) && accountAddress;

  return (
    <>
      {showDisconnectButton ? (
        <div className={`fixed z-40 top-7 right-0.5 hidden md:block`}>
          <div className={`rounded-[0.75rem] overflow-hidden`}>
            <div
              className={`cursor-pointer flex px-4 text-notifi-tab-unselected-text w-52 py-2 ${
                isWalletMenuOpen
                  ? 'bg-notifi-wallet-menu-card-bg border border-transparent'
                  : ''
              } 
              `}
              onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
            >
              <Icon
                id={'user-protrait'}
                className={`text-notifi-icon-unselected mt-[0.125rem]`}
              />
              <div className="ml-2">
                {accountAddress.slice(0, 6)} ... {accountAddress.slice(-6)}
              </div>
            </div>

            {isWalletMenuOpen ? (
              <div
                className={`flex px-4 text-notifi-tab-unselected-text w-52 py-2 bg-notifi-wallet-menu-card-bg border-t border-[#565A8D]`}
                onClick={() => {
                  if (keys) wallets[selectedWallet].disconnect();
                }}
              >
                <Icon id={'leave'} className={`text-notifi-icon-unselected`} />
                <div className="ml-2 cursor-pointer">Disconnect</div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <NotifiContextWrapper>{children}</NotifiContextWrapper>;
    </>
  );
}
