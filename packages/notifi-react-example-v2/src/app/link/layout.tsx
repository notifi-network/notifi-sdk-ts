'use client';

import {
  AuthParams,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
import { NotifiSmartLinkContextProvider } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import React, { Suspense } from 'react';

export default function NotifiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallets, selectedWallet } = useWallets();
  const env = process.env.NEXT_PUBLIC_ENV;
  if (!env) {
    throw new Error('NEXT_PUBLIC_ENV is not defined');
  }
  const authParams: AuthParamsWithPublickey | undefined = React.useMemo(() => {
    if (selectedWallet === 'metamask') {
      return {
        walletPublicKey: wallets[selectedWallet].walletKeys?.hex ?? '',
        walletBlockchain: 'ARBITRUM',
      };
    }

    /* Impl other wallet logic if needed. Example below: */
    // if (selectedWallet === 'phantom') {
    //   return {
    //     walletPublicKey: wallets[selectedWallet].walletKeys?.base58 ?? '',
    //     walletBlockchain: 'SOLANA',
    //   };
    // }
  }, [wallets, selectedWallet]);

  return (
    <Suspense>
      <NotifiSmartLinkContextProvider
        env={env as NotifiEnvironment}
        authParams={authParams}
      >
        {children}
      </NotifiSmartLinkContextProvider>
    </Suspense>
  );
}

type AuthParamsWithPublickey = Extract<
  AuthParams,
  { walletPublicKey: string } & { accountAddress?: never }
>;
