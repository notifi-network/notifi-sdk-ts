import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { Ethereum, MetamaskWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  getProvider,
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
      errorHandler(new Error('Metamask account changed'));

      getProvider('isMetaMask')
        ?.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const walletKeys = {
            bech32: converter('inj').toBech32(accounts[0]), // TODO: dynamic cosmos chain addr conversion
            hex: accounts[0],
          };
          setWalletKeysMetamask(walletKeys);
        });
    };
    return () => {
      getProvider('isMetaMask')?.removeListener(
        'accountsChanged',
        handleAccountChange,
      );
      loadingHandler(false);
    };
  }, []);

  const connectMetamask = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    const metaMaskProvider = getProvider('isMetaMask');

    if (!metaMaskProvider) {
      handleMetamaskNotExists('connectMetamask');
      return null;
    }
    loadingHandler(true);

    const timeout = setTimeout(() => {
      disconnectMetamask();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    // NOTE: metaMaskProvider.request's error is not catchable, instead use timeout
    const accounts = await metaMaskProvider.request({
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
      const metaMaskProvider = getProvider('isMetaMask');

      if (!metaMaskProvider || !walletKeysMetamask) {
        handleMetamaskNotExists('signArbitraryMetamask');
        return;
      }
      loadingHandler(true);
      try {
        const signature: Promise<`0x${string}`> =
          await metaMaskProvider.request({
            method: 'personal_sign',
            params: [
              Buffer.from(message).toString('hex'),
              /** ⬆️
               * hex-encoded UTF-8 string to present to the user. See how to encode a string like this in the browser-string-hexer module.
               * @ref https://docs.metamask.io/wallet/reference/personal_sign/
               */
              walletKeysMetamask?.hex,
            ],
          });
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
  if (typeof window === 'undefined') {
    throw new Error('Cannot get Metamask without a window');
  }
  const metaMaskProvider = getProvider('isMetaMask');
  if (metaMaskProvider) {
    return metaMaskProvider;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Metamask extension');
  }

  return new Promise<Ethereum>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        const metaMaskProvider = getProvider('isMetaMask');
        if (metaMaskProvider) {
          resolve(metaMaskProvider);
        } else {
          reject('Please install the Metamask extension');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
