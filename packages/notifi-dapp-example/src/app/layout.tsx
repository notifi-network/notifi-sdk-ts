import { GlobalStateContextProvider } from '@/context/GlobalStateContext';
import { NotifiWalletsWrapper } from '@/context/NotifiWalletsWrapper';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XION',
  description: 'XION x Notifi Inbox',
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
        className={`${inter.className} notifi-dapp bg-notifi-solid-bg`}
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
