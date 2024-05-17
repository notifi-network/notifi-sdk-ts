import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
);

export type ConfigArgs = {
  walletConnectProjectId?: string;
  coinbaseWalletAppName?: string;
};

export const getConfig = ({
  walletConnectProjectId,
  coinbaseWalletAppName,
}: ConfigArgs) => {
  const connectors = [];

  if (coinbaseWalletAppName)
    connectors.push(
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: coinbaseWalletAppName,
        },
      }),
    );

  if (walletConnectProjectId)
    connectors.push(
      new WalletConnectConnector({
        chains,
        options: {
          projectId: walletConnectProjectId,
          qrModalOptions: {
            explorerExcludedWalletIds: 'ALL',
            enableExplorer: false,
          },
        },
      }),
    );

  return createConfig({
    autoConnect: false,
    connectors: connectors,
    publicClient,
    webSocketPublicClient,
  });
};
