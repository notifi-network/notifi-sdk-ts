import { createConfig, http } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// TODO: use EVM_BLOCKCHAINS
export const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Notifi' }),
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
    [polygon.id]: http(),
  },
});
