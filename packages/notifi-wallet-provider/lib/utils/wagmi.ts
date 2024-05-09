import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({ appName: 'Notifi' }), //TODO: make it dynamic
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
  },
});
