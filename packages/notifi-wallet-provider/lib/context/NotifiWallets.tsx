import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useKeplr } from '../hooks/useKeplr';
import { useSyncInjectedProviders } from '../hooks/useSyncInjectedProviders';
import { useWallet } from '../hooks/useWallet';
import {
  CoinbaseWallet,
  Ethereum,
  KeplrWallet,
  MetamaskWallet,
  OKXWallet,
  RabbyWallet,
  RainbowWallet,
  Wallets,
  ZerionWallet,
} from '../types';
import { getWalletsFromLocalStorage } from '../utils/localStorageUtils';

type WalletContextType = {
  selectedWallet: keyof Wallets | null;
  selectWallet: (wallet: keyof Wallets) => void;
  wallets: Wallets;
  error: Error | null;
  isLoading: boolean;
};
const WalletContext = createContext<WalletContextType>({
  selectedWallet: null,
  selectWallet: () => {
    console.log('Not implemented');
  },
  wallets: {
    metamask: {} as any, // intentionally empty initial object
    keplr: {} as any, // intentionally empty initial object
    coinbase: {} as any, // intentionally empty initial object
    rabby: {} as any, // intentionally empty initial object
    rainbow: {} as any, // intentionally empty initial object
    zerion: {} as any, // intentionally empty initial object
    okx: {} as any, // intentionally empty initial object
  },
  error: null,
  isLoading: false,
});

let timer: number | NodeJS.Timeout;

export const NotifiWalletProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
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

  const injectedProviders = useSyncInjectedProviders();

  const getProviderByName = (name: string) =>
    injectedProviders.find(
      (v) =>
        v.info?.rdns?.toLowerCase().includes(name.toLowerCase()) ||
        v.info?.name?.toLowerCase().includes(name.toLowerCase()),
    )?.provider as unknown as Ethereum;

  const providerList = useMemo(() => {
    const metamask = getProviderByName('metamask');
    const coinbase = getProviderByName('coinbase');
    const okx = getProviderByName('okx');
    const rabby = getProviderByName('rabby');
    const zerion = getProviderByName('zerion');
    const rainbow = getProviderByName('rainbow');

    return { metamask, coinbase, zerion, rabby, rainbow, okx };
  }, [injectedProviders]);

  const keplr = useKeplr(setIsLoading, throwError, selectWallet);
  const metamask = useWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'metamask',
    providerList.metamask,
  );
  const coinbase = useWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'coinbase',
    providerList.coinbase,
  );
  const okx = useWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'okx',
    providerList.okx,
  );
  const zerion = useWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'zerion',
    providerList.zerion,
  );
  const rabby = useWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rabby',
    providerList.rabby,
  );
  const rainbow = useWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rainbow',
    providerList.rainbow,
  );

  const wallets: Wallets = {
    metamask: new MetamaskWallet(
      metamask.isWalletInstalled,
      metamask.walletKeys,
      metamask.signArbitrary,
      metamask.connectWallet,
      metamask.disconnectWallet,
    ),
    coinbase: new CoinbaseWallet(
      coinbase.isWalletInstalled,
      coinbase.walletKeys,
      coinbase.signArbitrary,
      coinbase.connectWallet,
      coinbase.disconnectWallet,
    ),
    rabby: new RabbyWallet(
      rabby.isWalletInstalled,
      rabby.walletKeys,
      rabby.signArbitrary,
      rabby.connectWallet,
      rabby.disconnectWallet,
    ),
    zerion: new ZerionWallet(
      zerion.isWalletInstalled,
      zerion.walletKeys,
      zerion.signArbitrary,
      zerion.connectWallet,
      zerion.disconnectWallet,
    ),
    rainbow: new RainbowWallet(
      rainbow.isWalletInstalled,
      rainbow.walletKeys,
      rainbow.signArbitrary,
      rainbow.connectWallet,
      rainbow.disconnectWallet,
    ),
    okx: new OKXWallet(
      okx.isWalletInstalled,
      okx.walletKeys,
      okx.signArbitrary,
      okx.connectWallet,
      okx.disconnectWallet,
    ),
    keplr: new KeplrWallet(
      keplr.isKeplrInstalled,
      keplr.walletKeysKeplr,
      keplr.signArbitraryKeplr,
      keplr.connectKeplr,
      keplr.disconnectKeplr,
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
        wallets[walletName].connect().then(() => selectWallet(walletName));
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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
export const useWallets = () => React.useContext(WalletContext);
export default NotifiWalletProvider;
