import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { WagmiProvider, createConfig } from 'wagmi';

import { defaultWagmiConfig } from '../utils/wagmi';

export type NotifiWagmiProviderProps = PropsWithChildren & {
  wagmiConfig?: ReturnType<typeof createConfig>;
};

export const NotifiWagmiProvider: React.FC<NotifiWagmiProviderProps> = ({
  children,
  wagmiConfig,
}) => {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={wagmiConfig ?? defaultWagmiConfig}>
      {/* //TODO: tanstack query client should be in the peer dependency. And ask DAPP (consumer of notifi-wallet-provider) to wrap app component with it */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
