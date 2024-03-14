import { GlobalStateContextProvider } from '@/context/GlobalStateContext';
import { NotifiWalletsWrapper } from '@/context/wallet/NotifiWalletsWrapper';
import '@interchain-ui/react/styles';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notifi Dapp Example',
  description: 'Notifi Dapp Example',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <NotifiWalletsWrapper>{children}</NotifiWalletsWrapper>
        </GlobalStateContextProvider>
      </body>
    </html>
  );
}
