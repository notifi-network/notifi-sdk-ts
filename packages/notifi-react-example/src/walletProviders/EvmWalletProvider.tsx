// Example makes use of `wagmi` with `ether.js` on Ethereum --> `npm install wagmi ethers@^5`
import { getDefaultProvider } from 'ethers';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { Chain, WagmiConfig, configureChains, createClient, mainnet, } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { infuraProvider } from 'wagmi/providers/infura';

const theRootNetwork: Chain = {
  /** ID in number form */
  id: 7668,
  /** Human-readable name */
  name: "The Root Network",
  /** Internal network name */
  network: "TRN",
  /** Currency used by chain */
  nativeCurrency: {
    name: "XRP",
    /** 2-6 characters long */
    symbol: 'XRP',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://root.rootnet.live/archive"],
      webSocket: ["wss://root.rootnet.live/archive/ws"]
    },
    public: {
      http: ["https://root.rootnet.live/archive"],
      webSocket: ['wss://root.rootnet.live/archive/ws']
    }
  }
}

export const connector = new WalletConnectConnector({
  chains: [mainnet, theRootNetwork],
  options: {
    projectId: 'f633a048d4392b31be9fce99e7b417db',
  },
});

type EvmWalletProviderContextData = {
  walletAdapter: 'walletconnect' | 'metamask';
  setWalletAdapter: React.Dispatch<
    React.SetStateAction<'metamask' | 'walletconnect'>
  >;
};

const EvmWalletProviderContext = createContext<EvmWalletProviderContextData>(
  {} as EvmWalletProviderContextData,
);

export const useEvmWallet = () => {
  const context = useContext(EvmWalletProviderContext);
  if (!context) {
    throw new Error('useEvmWallet must be used within a EvmWalletProvider');
  }
  return context;
};

export const EvmWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [walletAdapter, setWalletAdapter] = useState<
    'walletconnect' | 'metamask'
  >('metamask');

  const metamaskClient = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
  });

  const { provider } = configureChains(
    [mainnet],
    [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_API_KEY! })],
  );
  const walletConnectClient = createClient({
    autoConnect: true,
    connectors: [connector],
    provider: provider,
  });

  return (
    <EvmWalletProviderContext.Provider
      value={{ walletAdapter, setWalletAdapter }}
    >
      {walletAdapter === 'metamask' ? (
        <WagmiConfig client={metamaskClient}>{children}</WagmiConfig>
      ) : (
        <WagmiConfig client={walletConnectClient}>{children}</WagmiConfig>
      )}
    </EvmWalletProviderContext.Provider>
  );
};
