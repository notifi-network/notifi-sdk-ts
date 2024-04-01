import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

import { useKeplr } from '../hooks/useKeplr';
import { useMetamask } from '../hooks/useMetamask';
import { KeplrWallet, MetamaskWallet, Wallets } from '../types';
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
  },
  error: null,
  isLoading: false,
});

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
    setError(e);
    setTimeout(() => {
      setError(null);
    }, durationInMs ?? 5000);
  };

  const metamask = useMetamask(setIsLoading, throwError, selectWallet);

  const keplr = useKeplr(setIsLoading, throwError, selectWallet);

  const wallets: Wallets = {
    metamask: new MetamaskWallet(
      metamask.isMetamaskInstalled,
      metamask.walletKeysMetamask,
      metamask.signArbitraryMetamask,
      metamask.connectMetamask,
      metamask.disconnectMetamask,
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
      if (Object.keys(wallets).includes(walletName)) {
        wallets[storageWallet.walletName]
          .connect()
          .then(() => selectWallet(walletName));
      }
    }
  }, []);

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
