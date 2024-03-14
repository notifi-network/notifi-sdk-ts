import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { Ethereum, MetamaskWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';

export const useMetamask = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeysMetamask, setWalletKeysMetamask] =
    useState<MetamaskWalletKeys | null>(null);
  const [isMetamaskInstalled, setIsMetamaskInstalled] =
    useState<boolean>(false);

  useEffect(() => {
    loadingHandler(true);
    getWalletFromWindow()
      .then((metamask) => {
        setIsMetamaskInstalled(true);
        metamask.on('accountsChanged', handleAccountChange);
      })
      .catch((e) => {
        errorHandler(new Error(e));
        setIsMetamaskInstalled(false);
      })
      .finally(() => loadingHandler(false));
    const handleAccountChange = () => {
      console.log('Metamask account changed');

      if (!window.ethereum) return;
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const walletKeys = {
            bech32: converter('inj').toBech32(accounts[0]), // TODO: dynamic cosmos chain addr conversion
            hex: accounts[0],
          };
          setWalletKeysMetamask(walletKeys);
        });
    };
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  const connectMetamask = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    if (!window.ethereum) {
      errorHandler(new Error('Metamask not initialized'));
      return null;
    }
    loadingHandler(true);
    console.log('resequsting accounts');

    const closeTimeout = () => {
      clearTimeout(timeout);
    };

    const timeout = setTimeout(() => {
      console.log('timeout');
      disconnectMetamask();
      loadingHandler(false);
      window.ethereum.removeListener('connect', closeTimeout);
    }, timeoutInMiniSec ?? 5000);

    // NOTE: connect event listener if needed
    // window.ethereum.on('connect', () => {
    //   console.log('connected');
    //   window.ethereum.removeListener('connect', closeTimeout);
    // });

    const accounts = await window.ethereum.request({
      // NOTE: window.ethereum.request's error is not catchable, instead use timeout
      method: 'eth_requestAccounts',
    });
    const walletKeys = {
      bech32: converter('inj').toBech32(accounts[0]),
      hex: accounts[0],
    };
    selectWallet('metamask');
    setWalletKeysMetamask(walletKeys);
    setWalletKeysToLocalStorage('metamask', walletKeys);
    loadingHandler(false);
    clearTimeout(timeout);
    return walletKeys;
  };

  const disconnectMetamask = () => {
    setWalletKeysMetamask(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitraryMetamask = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      if (!window.ethereum || !walletKeysMetamask) {
        errorHandler(new Error('Metamask not initialized or not connected'));
        return;
      }
      loadingHandler(true);
      try {
        const signature: Promise<`0x${string}`> = await window.ethereum.request(
          {
            method: 'personal_sign',
            // A hex-encoded UTF-8 string to present to the user. See how to encode a string like this in the browser-string-hexer module.
            // TODO: hex encode the message
            params: [
              Buffer.from(message).toString('hex'),
              walletKeysMetamask?.hex,
            ],
          },
        );
        // A hex-encoded 129-byte array starting with 0x.
        return signature;
      } catch (e) {
        errorHandler(
          new Error('Metamask signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysMetamask?.hex],
  );

  return {
    walletKeysMetamask,
    isMetamaskInstalled,
    connectMetamask,
    signArbitraryMetamask,
    disconnectMetamask,
  };
};

export const getWalletFromWindow = async (): Promise<Ethereum> => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot get Metamask without a window');
  }
  if (window.ethereum) {
    return window.ethereum;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Metamask extension');
  }

  return new Promise<Ethereum>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.ethereum) {
          resolve(window.ethereum);
        } else {
          reject('Please install the Metamask extension');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
