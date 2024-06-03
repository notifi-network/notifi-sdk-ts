import { createConfig, http } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({ appName: 'Notifi', version: '3', darkMode: true }), //TODO: make it dynamic
    walletConnect({
      projectId: '632a105feb9cf8380428a4f240eb6f13',
      isNewChainsStale: true,
      qrModalOptions: {
        themeMode: 'dark',
        explorerExcludedWalletIds: 'ALL',
        enableExplorer: false,
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
