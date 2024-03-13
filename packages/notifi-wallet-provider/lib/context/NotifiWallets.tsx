import React, { PropsWithChildren, createContext, useState } from 'react';

import { useKeplr } from '../hooks/useKeplr';
import { useMetamask } from '../hooks/useMetamask';
import { KeplrWallet, MetamaskWallet, Wallets } from '../types';

type WalletContextType = {
  selectedWallet: keyof Wallets | null;
  selectWallet: (wallet: keyof Wallets) => void;
  wallets: Wallets;
  error: Error | null;
  loading: boolean;
};
const WalletContext = createContext<WalletContextType>({
  selectedWallet: null,
  selectWallet: () => {
    console.log('Not implemented');
  },
  wallets: {
    metamask: {} as any, // TODO: handle type
    keplr: {} as any, // TODO: handle type
  },
  error: null,
  loading: false,
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
  const [loading, setLoading] = useState<boolean>(false);

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
  } = useMetamask(setLoading, throwError);

  const {
    isKeplrInstalled,
    walletKeysKeplr,
    connectKeplr,
    signArbitraryKeplr,
  } = useKeplr(setLoading, throwError);

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
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
export const useWallets = () => React.useContext(WalletContext);
export default NotifiWalletProvider;
