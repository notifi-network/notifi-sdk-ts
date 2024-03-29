'use client';

import {
  cleanWalletsInLocalStorage,
  getWalletsFromLocalStorage,
  setInjWalletKeysToLocalStorage,
} from '@/utils/localStorageUtils';
import {
  InjectiveWallets,
  LeapWallet,
  LeapWalletKeys,
  PhantomWallet,
  PhantomWalletKeys,
} from '@/utils/types';
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
import { Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';
import converter from 'bech32-converting';
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

type WalletContextType = {
  selectedWallet: keyof InjectiveWallets | null;
  selectWallet: (wallet: keyof InjectiveWallets) => void;
  wallets: InjectiveWallets;
  error: Error | null;
  isLoading: boolean;
};
const WalletContext = createContext<WalletContextType>({
  selectedWallet: null,
  selectWallet: () => {
    console.log('Not implemented');
  },
  wallets: {
    leap: {} as any, // intentionally empty initial object
    phantom: {} as any, // intentionally empty initial object
  },
  error: null,
  isLoading: false,
});

export const InjectiveWalletProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<
    keyof InjectiveWallets | null
  >(null);
  const [walletKeysLeap, setWalletKeysLeap] = useState<LeapWalletKeys | null>(
    null,
  );
  const [walletKeysPhantom, setWalletKeysPhantom] =
    useState<PhantomWalletKeys | null>(null);
  const selectWallet = (wallet: keyof InjectiveWallets | null) => {
    setSelectedWallet(wallet);
  };

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const connectLeapWallet = async () => {
    if (!injectiveLeapWallet.strategies.leap) {
      return null;
    }
    setIsLoading(true);
    try {
      injectiveLeapWallet.setWallet(Wallet.Leap);
      const key = await injectiveLeapWallet.getPubKey();
      const accounts = await injectiveLeapWallet.getAddresses();
      const walletKeys = {
        bech32: accounts[0],
        base64: key,
      };
      selectWallet('leap');
      setWalletKeysLeap(walletKeys);
      setInjWalletKeysToLocalStorage('leap', walletKeys);
      setIsLoading(false);
      return walletKeys;
    } catch (e) {
      throwError(
        new Error('Leap connection failed, check console for details'),
      );
      console.error(e);
    }
    setIsLoading(false);
    return null;
  };

  const connectPhantomWallet = async () => {
    if (!window.solana) {
      return null;
    }
    if (!injectivePhantomWallet.strategies.phantom) {
      return null;
    }
    setIsLoading(true);
    try {
      injectivePhantomWallet.setWallet(Wallet.Phantom);
      const accounts = await injectivePhantomWallet.getAddresses();
      const walletKeys = {
        bech32: converter('inj').toBech32(accounts[0]),
        hex: accounts[0],
      };
      selectWallet('phantom');
      setWalletKeysPhantom(walletKeys);
      setInjWalletKeysToLocalStorage('phantom', walletKeys);
      setIsLoading(false);
      return walletKeys;
    } catch (e) {
      throwError(
        new Error('Leap connection failed, check console for details'),
      );
      console.error(e);
    }
    setIsLoading(false);
    return null;
  };

  const leapSignArbitrary = useCallback(
    async (message: string) => {
      if (!walletKeysLeap || !injectiveLeapWallet.strategies.leap) {
        return;
      }
      setIsLoading(true);
      try {
        const result = await injectiveLeapWallet.signArbitrary(
          walletKeysLeap.bech32,
          message,
        );
        return result;
      } catch (e) {
        throwError(
          new Error('Leap signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      setIsLoading(false);
    },
    [walletKeysLeap],
  );

  const phantomSignArbitrary = useCallback(
    async (message: string) => {
      if (!walletKeysPhantom || !injectivePhantomWallet.strategies.phantom) {
        return;
      }
      setIsLoading(true);
      try {
        const accounts = await injectivePhantomWallet.getAddresses();
        const result = await injectivePhantomWallet.signArbitrary(
          accounts[0],
          message,
        );
        return result;
      } catch (e) {
        throwError(
          new Error('Phantom signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      setIsLoading(false);
    },
    [walletKeysPhantom],
  );

  const disconnectLeapWallet = useCallback(async () => {
    injectiveLeapWallet.disconnect();
    selectWallet(null);
    setWalletKeysLeap(null);
    cleanWalletsInLocalStorage();
  }, []);

  const disconnectPhantomWallet = useCallback(async () => {
    injectivePhantomWallet.disconnect();
    selectWallet(null);
    setWalletKeysLeap(null);
    cleanWalletsInLocalStorage();
  }, []);

  const throwError = (e: Error, durationInMs?: number) => {
    setError(e);
    setTimeout(() => {
      setError(null);
    }, durationInMs ?? 5000);
  };

  const injectiveLeapWallet = new WalletStrategy({
    chainId: ChainId.Mainnet,
    wallet: Wallet.Leap,
  });

  const injectivePhantomWallet = new WalletStrategy({
    chainId: ChainId.Mainnet,
    ethereumOptions: {
      ethereumChainId: EthereumChainId.Mainnet,
    },
    wallet: Wallet.Phantom,
  });

  const wallets: InjectiveWallets = {
    leap: new LeapWallet(
      injectiveLeapWallet.strategies.leap ? true : false,
      walletKeysLeap,
      leapSignArbitrary,
      connectLeapWallet,
      disconnectLeapWallet,
    ),
    phantom: new PhantomWallet(
      injectivePhantomWallet.strategies.phantom ? true : false,
      walletKeysPhantom,
      phantomSignArbitrary,
      connectPhantomWallet,
      disconnectPhantomWallet,
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
export const useInjectiveWallets = () => React.useContext(WalletContext);
export default InjectiveWalletProvider;
