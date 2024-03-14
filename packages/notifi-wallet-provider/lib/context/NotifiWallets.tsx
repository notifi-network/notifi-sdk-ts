import React, { PropsWithChildren, createContext, useState } from 'react';

import { useKeplr } from '../hooks/useKeplr';
import { useMetamask } from '../hooks/useMetamask';
import { KeplrWallet, MetamaskWallet, Wallets } from '../types';

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
  const [selectedWallet, setSelectedWallet] = useState<
    'metamask' | 'keplr' | null
  >(null);
  const selectWallet = (wallet: 'metamask' | 'keplr') => {
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

  const {
    walletKeysMetamask,
    isMetamaskInstalled,
    connectMetamask,
    signArbitraryMetamask,
  } = useMetamask(setIsLoading, throwError);

  const {
    isKeplrInstalled,
    walletKeysKeplr,
    connectKeplr,
    signArbitraryKeplr,
  } = useKeplr(setIsLoading, throwError);

  return (
    <WalletContext.Provider
      value={{
        selectedWallet,
        selectWallet,
        wallets: {
          metamask: new MetamaskWallet(
            isMetamaskInstalled,
            walletKeysMetamask,
            signArbitraryMetamask,
            connectMetamask,
          ),
          keplr: new KeplrWallet(
            isKeplrInstalled,
            walletKeysKeplr,
            signArbitraryKeplr,
            connectKeplr,
          ),
        },
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
