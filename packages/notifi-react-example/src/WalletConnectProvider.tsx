// Example makes use of `wagmi` with `ether.js` on Ethereum --> `npm install wagmi ethers@^5`
import { FC, PropsWithChildren } from 'react';
import { WagmiConfig, configureChains, createClient, mainnet } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { infuraProvider } from 'wagmi/providers/infura';

export const connector = new WalletConnectConnector({
  chains: [mainnet],
  options: {
    projectId: 'f633a048d4392b31be9fce99e7b417db',
  },
});

export const WalletConnectProvider: FC<PropsWithChildren> = ({ children }) => {
  const { provider } = configureChains(
    [mainnet],
    [infuraProvider({ apiKey: '9c9ff698105d4f6b9b2b93eddc0dff72' })],
  );
  const client = createClient({
    autoConnect: true,
    connectors: [connector],
    provider: provider,
  });
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
