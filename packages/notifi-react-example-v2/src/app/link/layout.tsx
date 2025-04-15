'use client';

import { AuthParams } from '@notifi-network/notifi-frontend-client';
import { NotifiSmartLinkContextProvider } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import React, { Suspense } from 'react';

export default function NotifiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallets, selectedWallet } = useWallets();
  const authParams: Extract<
    AuthParams,
    { walletPublicKey: string } & { accountAddress?: never }
  > = React.useMemo(() => {
    if (selectedWallet === 'metamask') {
      return {
        walletPublicKey: wallets[selectedWallet].walletKeys?.hex ?? '',
        walletBlockchain: 'ARBITRUM',
      };
    }
    /* Impl other wallet logic if needed */

    // If not defined, fallback to a default value
    return {
      walletPublicKey: '0x000',
      walletBlockchain: 'ARBITRUM',
    };
  }, [wallets, selectedWallet]);

  return (
    <Suspense>
      <NotifiSmartLinkContextProvider
        env={'Development'}
        authParams={authParams}
      >
        {children}
      </NotifiSmartLinkContextProvider>
    </Suspense>
  );
}
