import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Buffer } from 'buffer';
import React, { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../utils/wagmi';

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

export const NotifiWagmiProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
