import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import { useBackpack } from '../hooks/useBackpack';
import { useBinance } from '../hooks/useBinance';
import { useInjectedWallet } from '../hooks/useInjectedWallet';
import { useKeplr } from '../hooks/useKeplr';
import { useLeap } from '../hooks/useLeap';
import { usePhantom } from '../hooks/usePhantom';
import { useSolflare } from '../hooks/useSolflare';
import { useWagmiWallet } from '../hooks/useWagmiWallet';
import {
  BackpackWallet,
  BinanceWallet,
  CoinbaseWallet,
  KeplrWallet,
  LeapWallet,
  MetamaskWallet,
  OKXWallet,
  PhantomWallet,
  RabbyWallet,
  RainbowWallet,
  SolflareWallet,
  WalletConnectWallet,
  Wallets,
  ZerionWallet,
} from '../types';
import { getWalletsFromLocalStorage } from '../utils/localStorageUtils';
import { NotifiWagmiProvider } from './WagmiProvider';

export type EVMChains = 'ethereum' | 'polygon' | 'arbitrum' | 'injective';

export type AvailableChains = EVMChains | 'solana' | 'osmosis';

let timer: number | NodeJS.Timeout;

type WalletContextType = {
  selectedWallet: keyof Wallets | null;
  selectWallet: (wallet: keyof Wallets) => void;
  wallets: Wallets;
  error: Error | null;
  isLoading: boolean;
  selectedChain: AvailableChains;
  switchChain: (chain: AvailableChains) => void;
};
const WalletContext = createContext<WalletContextType>({
  selectedWallet: null,
  selectWallet: () => {
    console.log('Not implemented');
  },
  wallets: {
    metamask: {} as MetamaskWallet, // intentionally empty initial object
    keplr: {} as KeplrWallet, // intentionally empty initial object
    leap: {} as LeapWallet, // intentionally empty initial object
    phantom: {} as PhantomWallet, // intentionally empty initial object
    backpack: {} as BackpackWallet, // intentionally empty initial object
    solflare: {} as SolflareWallet, // intentionally empty initial object
    coinbase: {} as CoinbaseWallet, // intentionally empty initial object
    rabby: {} as RabbyWallet, // intentionally empty initial object
    rainbow: {} as RainbowWallet, // intentionally empty initial object
    zerion: {} as ZerionWallet, // intentionally empty initial object
    okx: {} as OKXWallet, // intentionally empty initial object
    binance: {} as BinanceWallet, // intentionally empty initial object
    walletconnect: {} as WalletConnectWallet, // intentionally empty initial object
  },
  error: null,
  isLoading: false,
  selectedChain: 'ethereum',
  switchChain: () => {
    console.log('Not implemented');
  },
});

const NotifiWallet: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedChain, setSelectedChain] =
    useState<AvailableChains>('ethereum');

  const switchChain = (chain: AvailableChains) => {
    setSelectedChain(chain);
  };

  const [selectedWallet, setSelectedWallet] = useState<keyof Wallets | null>(
    null,
  );
  const selectWallet = (wallet: keyof Wallets | null) => {
    setSelectedWallet(wallet);
  };

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const throwError = (e: Error, durationInMs?: number) => {
    clearTimeout(timer);
    setError(e);

    timer = setTimeout(() => {
      setError(null);
    }, durationInMs ?? 5000);
  };

  const keplr = useKeplr(setIsLoading, throwError, selectWallet, selectedChain);

  const leap = useLeap(setIsLoading, throwError, selectWallet, selectedChain);
  const phantom = usePhantom(
    setIsLoading,
    throwError,
    selectWallet,
    selectedChain,
  );
  const backPack = useBackpack(
    setIsLoading,
    throwError,
    selectWallet,
    selectedChain,
  );
  const solflare = useSolflare(
    setIsLoading,
    throwError,
    selectWallet,
    selectedChain,
  );
  const binance = useBinance(setIsLoading, throwError, selectWallet);
  const walletConnect = useWagmiWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'walletconnect',
    selectedChain,
  );
  const coinbase = useWagmiWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'coinbase',
    selectedChain,
  );
  const metamask = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'metamask',
    selectedChain,
  );
  const okx = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'okx',
    selectedChain,
  );
  const zerion = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'zerion',
    selectedChain,
  );
  const rabby = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rabby',
    selectedChain,
  );
  const rainbow = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rainbow',
    selectedChain,
  );

  const wallets: Wallets = {
    metamask: new MetamaskWallet(
      metamask.isWalletInstalled,
      metamask.walletKeys,
      metamask.signArbitrary,
      metamask.connectWallet,
      metamask.disconnectWallet,
      metamask.websiteURL,
    ),
    coinbase: new CoinbaseWallet(
      coinbase.isWalletInstalled,
      coinbase.walletKeys,
      coinbase.signArbitrary,
      coinbase.connectWallet,
      coinbase.disconnectWallet,
      coinbase.websiteURL,
    ),
    rabby: new RabbyWallet(
      rabby.isWalletInstalled,
      rabby.walletKeys,
      rabby.signArbitrary,
      rabby.connectWallet,
      rabby.disconnectWallet,
      rabby.websiteURL,
    ),
    walletconnect: new WalletConnectWallet(
      walletConnect.isWalletInstalled,
      walletConnect.walletKeys,
      walletConnect.signArbitrary,
      walletConnect.connectWallet,
      walletConnect.disconnectWallet,
      walletConnect.websiteURL,
    ),
    binance: new BinanceWallet(
      binance.isWalletInstalled,
      binance.walletKeys,
      binance.signArbitrary,
      binance.connectWallet,
      binance.disconnectWallet,
      binance.websiteURL,
    ),
    okx: new OKXWallet(
      okx.isWalletInstalled,
      okx.walletKeys,
      okx.signArbitrary,
      okx.connectWallet,
      okx.disconnectWallet,
      okx.websiteURL,
    ),
    rainbow: new RainbowWallet(
      rainbow.isWalletInstalled,
      rainbow.walletKeys,
      rainbow.signArbitrary,
      rainbow.connectWallet,
      rainbow.disconnectWallet,
      rainbow.websiteURL,
    ),
    zerion: new ZerionWallet(
      zerion.isWalletInstalled,
      zerion.walletKeys,
      zerion.signArbitrary,
      zerion.connectWallet,
      zerion.disconnectWallet,
      zerion.websiteURL,
    ),
    keplr: new KeplrWallet(
      keplr.isKeplrInstalled,
      keplr.walletKeysKeplr,
      keplr.signArbitraryKeplr,
      keplr.connectKeplr,
      keplr.disconnectKeplr,
      keplr.websiteURL,
    ),
    leap: new LeapWallet(
      leap.isLeapInstalled,
      leap.walletKeysLeap,
      leap.signArbitraryLeap,
      leap.connectLeap,
      leap.disconnectLeap,
      leap.websiteURL,
    ),
    phantom: new PhantomWallet(
      phantom.isPhantomInstalled,
      phantom.walletKeysPhantom,
      phantom.signArbitraryPhantom,
      phantom.connectPhantom,
      phantom.disconnectPhantom,
      phantom.websiteURL,
    ),
    backpack: new BackpackWallet(
      backPack.isBackpackInstalled,
      backPack.walletKeysBackpack,
      backPack.signArbitraryBackpack,
      backPack.connectBackpack,
      backPack.disconnectBackpack,
      backPack.websiteURL,
    ),
    solflare: new SolflareWallet(
      solflare.isSolflareInstalled,
      solflare.walletKeysSolflare,
      solflare.signArbitrarySolflare,
      solflare.connectSolflare,
      solflare.disconnectSolflare,
      solflare.websiteURL,
    ),
  };

  useEffect(() => {
    const storageWallet = getWalletsFromLocalStorage();
    if (storageWallet) {
      const walletName = storageWallet.walletName;
      if (
        Object.keys(wallets).includes(walletName) &&
        wallets[walletName].isInstalled &&
        !selectedWallet
      ) {
        wallets[walletName].connect();
        if (
          Object.keys(wallets).includes(walletName) &&
          wallets[walletName].isInstalled &&
          !selectedWallet
        ) {
          wallets[walletName].connect();
        }
      }
    }
  }, [wallets]);

  return (
    <WalletContext.Provider
      value={{
        selectedWallet,
        selectWallet,
        wallets,
        error,
        isLoading,
        selectedChain,
        switchChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const NotifiWalletProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <NotifiWagmiProvider>
      <NotifiWallet>{children}</NotifiWallet>
    </NotifiWagmiProvider>
  );
};

export const useWallets = () => React.useContext(WalletContext);
