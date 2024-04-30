import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    walletConnect({
      projectId: '632a105feb9cf8380428a4f240eb6f13',
      qrModalOptions: {
        explorerExcludedWalletIds: 'ALL',
        enableExplorer: false,
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
