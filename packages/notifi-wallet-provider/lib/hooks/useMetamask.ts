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

  const handleMetamaskNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.ethereum not initialized or not installed`,
      ),
    );
  };

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
      loadingHandler(false);
    };
  }, []);

  const connectMetamask = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    if (!window.ethereum) {
      handleMetamaskNotExists('connectMetamask');
      return null;
    }
    loadingHandler(true);

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
        handleMetamaskNotExists('signArbitraryMetamask');
        return;
      }
      loadingHandler(true);
      try {
        const signature: Promise<`0x${string}`> = await window.ethereum.request(
          {
            method: 'personal_sign',
            params: [
              Buffer.from(message).toString('hex'),
              /** ⬆️
               * hex-encoded UTF-8 string to present to the user. See how to encode a string like this in the browser-string-hexer module.
               * @ref https://docs.metamask.io/wallet/reference/personal_sign/
               */
              walletKeysMetamask?.hex,
            ],
          },
        );
        return signature;
        // ⬆️ Note:A hex-encoded 129-byte array starting with 0x.
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
  if (window.ethereum) {
    return window.ethereum;
  }

  return new Promise<Ethereum>((resolve) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.ethereum) {
          resolve(window.ethereum);
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
