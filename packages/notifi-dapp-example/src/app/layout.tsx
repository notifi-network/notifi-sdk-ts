'use client';

import { GlobalStateContextProvider } from '@/context/GlobalStateContext';
import { CosmosWalletProvider } from '@/context/wallet/CosmosWalletProvider';
// import NotifiWalletProvider from '@/context/wallet/NotifiWalletProvider';
import '@interchain-ui/react/styles';
import {
  NotifiWalletProvider,
  NotifiWalletsContext,
} from '@notifi-network/notifi-wallet-provider';
// import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// const metadata: Metadata = {
//   title: 'Notifi Dapp Example',
//   description: 'Notifi Dapp Example',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log('TT', TT);
  return (
    <html lang="en">
      <head>
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
      </head>
      <body
        className={`${inter.className} notifi-dapp bg-gradient-injective`}
        dark-mode="false"
        // NOTE: Not support dark/light mode yet. TODO: consider adding a theme wrapper
      >
        <GlobalStateContextProvider>
          <NotifiWalletProvider>
            {/* <NotifiWalletsContext> */}
            <CosmosWalletProvider>{children}</CosmosWalletProvider>
            {/* </NotifiWalletsContext> */}
          </NotifiWalletProvider>
        </GlobalStateContextProvider>
      </body>
    </html>
  );
}
