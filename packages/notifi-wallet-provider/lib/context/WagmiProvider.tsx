import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../utils/wagmi';

export const NotifiWagmiProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      {/* //TODO: tanstack query client should be in the peer dependency. And ask DAPP (consumer of notifi-wallet-provider) to wrap app component with it */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
