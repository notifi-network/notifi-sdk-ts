'use client';

import { GlobalStateContextProvider } from '@/context/GlobalStateContext';
import { NotifiWalletsWrapper } from '@/context/NotifiWalletsWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from 'next/font/google';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});
const queryClient = new QueryClient();

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
        className={`${inter.className} notifi-dapp bg-gradient-gmx`}
        dark-mode="true"
        // NOTE: Not support dark/light mode yet. TODO: consider adding a theme wrapper
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <GlobalStateContextProvider>
              <NotifiWalletsWrapper>{children}</NotifiWalletsWrapper>
            </GlobalStateContextProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
