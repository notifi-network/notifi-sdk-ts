import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { WagmiProvider, createConfig } from 'wagmi';

import { defaultWagmiConfig } from '../utils/wagmi';

export type NotifiWagmiProviderProps = PropsWithChildren & {
  wagmiConfig?: ReturnType<typeof createConfig>;
};

const queryClient = new QueryClient();

export const NotifiWagmiProvider: React.FC<NotifiWagmiProviderProps> = ({
  children,
  wagmiConfig,
}) => {
  return (
    <WagmiProvider config={wagmiConfig ?? defaultWagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
