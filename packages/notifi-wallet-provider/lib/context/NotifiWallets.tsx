import { Abstraxion, useModal } from '@burnt-labs/abstraxion';
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import { useBinance } from '../hooks/useBinance';
import { useInjectedWallet } from '../hooks/useInjectedWallet';
import { useKeplr } from '../hooks/useKeplr';
import { usePhantom } from '../hooks/usePhantom';
import { useWagmiWallet } from '../hooks/useWagmiWallet';
import { useXion } from '../hooks/useXion';
import {
  BinanceWallet,
  CoinbaseWallet,
  KeplrWallet,
  MetamaskWallet,
  OKXWallet,
  PhantomWallet,
  RabbyWallet,
  RainbowWallet,
  WalletConnectWallet,
  Wallets,
  XionWallet,
  ZerionWallet,
} from '../types';
import { getWalletsFromLocalStorage } from '../utils/localStorageUtils';
import { NotifiWagmiProvider } from './WagmiProvider';
import { XionProvider } from './XionProvider';

let timer: number | NodeJS.Timeout;

type WalletContextType = {
  selectedWallet: keyof Wallets | null;
  selectWallet: (wallet: keyof Wallets) => void;
  wallets: Wallets;
  error: Error | null;
  isLoading: boolean;
  isAuthenticationVerified: boolean;
};
const WalletContext = createContext<WalletContextType>({
  selectedWallet: null,
  selectWallet: () => {
    console.log('Not implemented');
  },
  wallets: {
    metamask: {} as MetamaskWallet, // intentionally empty initial object
    keplr: {} as KeplrWallet, // intentionally empty initial object
    coinbase: {} as CoinbaseWallet, // intentionally empty initial object
    rabby: {} as RabbyWallet, // intentionally empty initial object
    rainbow: {} as RainbowWallet, // intentionally empty initial object
    zerion: {} as ZerionWallet, // intentionally empty initial object
    okx: {} as OKXWallet, // intentionally empty initial object
    binance: {} as BinanceWallet, // intentionally empty initial object
    walletconnect: {} as WalletConnectWallet, // intentionally empty initial object
    xion: {} as XionWallet, // intentionally empty initial object
    phantom: {} as PhantomWallet, // intentionally empty initial object
  },
  error: null,
  isLoading: false,
  isAuthenticationVerified: false,
});

const NotifiWallet: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedWallet, setSelectedWallet] = useState<keyof Wallets | null>(
    null,
  );
  const selectWallet = (wallet: keyof Wallets | null) => {
    setSelectedWallet(wallet);
  };

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticationVerified, setIsAuthenticationVerified] =
    useState<boolean>(false);
  const [, setShowModal]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useModal();

  const throwError = (e: Error, durationInMs?: number) => {
    clearTimeout(timer);
    setError(e);

    timer = setTimeout(() => {
      setError(null);
    }, durationInMs ?? 5000);
  };

  const keplr = useKeplr(setIsLoading, throwError, selectWallet);
  const binance = useBinance(setIsLoading, throwError, selectWallet);
  const walletConnect = useWagmiWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'walletconnect',
  );
  const coinbase = useWagmiWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'coinbase',
  );
  const metamask = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'metamask',
  );
  const okx = useInjectedWallet(setIsLoading, throwError, selectWallet, 'okx');
  const zerion = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'zerion',
  );
  const rabby = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rabby',
  );
  const rainbow = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rainbow',
  );
  const xion = useXion(setIsLoading, throwError, selectWallet, 'xion');

  const phantom = usePhantom(setIsLoading, throwError, selectWallet);

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
    xion: new XionWallet(
      xion.isWalletInstalled,
      xion.walletKeys,
      xion.signArbitrary,
      xion.connectWallet,
      xion.disconnectWallet,
      xion.websiteURL,
    ),
    phantom: new PhantomWallet(
      phantom.isPhantomInstalled,
      phantom.walletKeysPhantom,
      phantom.signArbitraryPhantom,
      phantom.connectPhantom,
      phantom.disconnectPhantom,
      phantom.websiteURL,
      phantom.signTransactionPhantom,
    ),
  };

  useEffect(() => {
    const storageWallet = getWalletsFromLocalStorage();
    if (storageWallet) {
      const walletName = storageWallet.walletName;
      if (
        Object.keys(wallets).includes(walletName) &&
        wallets[walletName].isInstalled &&
        !selectedWallet &&
        walletName !== 'xion'
      ) {
        wallets[walletName].connect();
      }
    }
  }, [wallets]);

  useEffect(() => {
    const storageWallet = getWalletsFromLocalStorage();
    const walletName = storageWallet?.walletName;

    if (walletName) {
      if (selectedWallet) setIsAuthenticationVerified(true);
    } else setIsAuthenticationVerified(true);
  }, [selectedWallet]);

  return (
    <WalletContext.Provider
      value={{
        selectedWallet,
        selectWallet,
        wallets,
        error,
        isLoading,
        isAuthenticationVerified,
      }}
    >
      <Abstraxion
        onClose={() => {
          setShowModal(false);
        }}
      />
      {children}
    </WalletContext.Provider>
  );
};

export const NotifiWalletProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <NotifiWagmiProvider>
      <XionProvider>
        <NotifiWallet>{children}</NotifiWallet>
      </XionProvider>
    </NotifiWagmiProvider>
  );
};

export const useWallets = () => React.useContext(WalletContext);
export default NotifiWalletProvider;
