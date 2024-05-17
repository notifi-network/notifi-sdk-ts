'use client';

/** Note: This wrapper is to resolve the rendering client components in server component (RootLayout) */
import { NotifiWalletProvider } from '@notifi-network/notifi-wallet-provider';
import React, { FC, PropsWithChildren } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
const appName = process.env.NEXT_PUBLIC_COINBASE_APP_NAME;

export const NotifiWalletsWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NotifiWalletProvider
      walletConnectProjectId={projectId}
      coinbaseWalletAppName={appName}
    >
      {children}
    </NotifiWalletProvider>
  );
};
