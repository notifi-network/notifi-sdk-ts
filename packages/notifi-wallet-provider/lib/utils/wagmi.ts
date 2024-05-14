import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
);

export const connectors = [
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Notifi x GMX',
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: '632a105feb9cf8380428a4f240eb6f13',
      qrModalOptions: {
        explorerExcludedWalletIds: 'ALL',
        enableExplorer: false,
      },
    },
  }),
];

export const config = createConfig({
  autoConnect: false,
  connectors: connectors,
  publicClient,
  webSocketPublicClient,
});
