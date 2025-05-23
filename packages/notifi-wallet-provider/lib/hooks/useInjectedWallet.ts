import converter from 'bech32-converting';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Ethereum, MetamaskWalletKeys, WalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';
import { useSyncInjectedProviders } from './useSyncInjectedProviders';

export const useInjectedWallet = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  walletName: keyof Wallets,
) => {
  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  const handleWalletNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: ${walletName} not initialized or not installed`,
      ),
    );
  };

  const injectedProviders = useSyncInjectedProviders();

  const provider = useMemo(
    () =>
      injectedProviders.find(
        (v) =>
          v.info?.rdns?.toLowerCase().includes(walletName.toLowerCase()) ||
          v.info?.name?.toLowerCase().includes(walletName.toLowerCase()),
      )?.provider as unknown as Ethereum,
    [injectedProviders],
  );

  useEffect(() => {
    setIsWalletInstalled(!!provider);

    if (!provider) return;

    const handleAccountChange = () => {
      provider
        .request?.({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const walletKeys = {
            bech32: converter('inj').toBech32(accounts[0]), // TODO: dynamic cosmos chain addr conversion
            hex: accounts[0],
          };
          setWalletKeys(walletKeys);
        });
    };

    provider.on?.('accountsChanged', handleAccountChange);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountChange);
    };
  }, [provider]);

  const connectWallet = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    if (!provider) {
      handleWalletNotExists('Connect Wallet');
      return null;
    }

    loadingHandler(true);
    const timer = setTimeout(() => {
      disconnectWallet();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);
    let walletKeys: WalletKeys | null = null;
    try {
      const accounts = await provider.request?.({
        method: 'eth_requestAccounts',
      });

      walletKeys = {
        bech32: converter('inj').toBech32(accounts[0]),
        hex: accounts[0],
      };

      selectWallet(walletName);
      setWalletKeys(walletKeys);
      setWalletKeysToLocalStorage(walletName, walletKeys);
      // return walletKeys;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      disconnectWallet();
      if (e.message) {
        errorHandler(new Error(e.message));
      }
      return null;
    } finally {
      loadingHandler(false);
      clearTimeout(timer);
    }
    return walletKeys;
  };

  const disconnectWallet = () => {
    setWalletKeys(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitrary = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      if (!provider || !walletKeys) {
        handleWalletNotExists('Sign Arbitrary');
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      try {
        const signature: Promise<`0x${string}`> = await provider.request?.({
          method: 'personal_sign',
          params: [message, walletKeys?.hex],
        });

        return signature;
        // ⬆️ Note:A hex-encoded 129-byte array starting with 0x.
      } catch (e) {
        errorHandler(
          new Error('Wallet not signed. Please connect your wallet again.'),
        );
        console.error(e);
      } finally {
        loadingHandler(false);
        clearTimeout(timer);
      }
    },
    [walletKeys?.hex],
  );
  // TODO: define the type of transactions
  const sendTransaction = async (transaction: object) => {
    let txHash: string | undefined;
    try {
      txHash = await provider.request?.({
        method: 'eth_sendTransaction',
        params: [transaction],
      });
    } catch (e) {
      errorHandler(
        new Error(
          'useInjectedWallet-sendTransaction: Failed to send transaction',
        ),
        5000,
      );
      console.error(e);
    } finally {
      loadingHandler(false);
    }
    // TODO: add validator for txHash
    return txHash as `0x${string}` | undefined;
  };

  return {
    walletKeys,
    isWalletInstalled,
    connectWallet,
    signArbitrary,
    disconnectWallet,
    sendTransaction,
    websiteURL: walletsWebsiteLink[walletName],
  };
};
