import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { CoinbaseWalletKeys, Ethereum, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  getProvider,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';

export const useCoinbase = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeysCoinbase, setWalletKeysCoinbase] =
    useState<CoinbaseWalletKeys | null>(null);
  const [isCoinbaseInstalled, setIsCoinbaseInstalled] =
    useState<boolean>(false);

  const handleCoinbaseNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.coinbaseWallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    loadingHandler(true);
    getCoinbaseFromWindow()
      .then((coinbase) => {
        setIsCoinbaseInstalled(true);
        coinbase.on('accountsChanged', handleAccountChange);
      })
      .catch((e) => {
        errorHandler(new Error(e));
        setIsCoinbaseInstalled(false);
      })
      .finally(() => loadingHandler(false));

    const handleAccountChange = () => {
      errorHandler(new Error('Coinbase account changed'));

      getProvider('isCoinbaseWallet')
        ?.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const walletKeys = {
            bech32: converter('inj').toBech32(accounts[0]), // TODO: dynamic cosmos chain addr conversion
            hex: accounts[0],
          };
          setWalletKeysCoinbase(walletKeys);
        });
    };
    return () => {
      getProvider('isCoinbaseWallet')?.removeListener(
        'accountsChanged',
        handleAccountChange,
      );
      loadingHandler(false);
    };
  }, []);

  const connectCoinbase = async (
    timeoutInMiniSec?: number,
  ): Promise<CoinbaseWalletKeys | null> => {
    const coinbaseProvider = getProvider('isCoinbaseWallet');

    if (!coinbaseProvider) {
      handleCoinbaseNotExists('connectCoinbase');
      return null;
    }
    loadingHandler(true);

    const timeout = setTimeout(() => {
      disconnectCoinbase();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    // NOTE: coinbaseProvider.request's error is not catchable, instead use timeout
    const accounts = await coinbaseProvider.request({
      method: 'eth_requestAccounts',
    });
    const walletKeys = {
      bech32: converter('inj').toBech32(accounts[0]),
      hex: accounts[0],
    };
    selectWallet('coinbase');
    setWalletKeysCoinbase(walletKeys);
    setWalletKeysToLocalStorage('coinbase', walletKeys);
    loadingHandler(false);
    clearTimeout(timeout);
    return walletKeys;
  };

  const disconnectCoinbase = () => {
    setWalletKeysCoinbase(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitraryCoinbase = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      const coinbaseProvider = getProvider('isCoinbaseWallet');

      if (!coinbaseProvider || !walletKeysCoinbase) {
        handleCoinbaseNotExists('signArbitraryCoinbase');
        return;
      }
      loadingHandler(true);
      try {
        const signature: Promise<`0x${string}`> =
          await coinbaseProvider.request({
            method: 'personal_sign',
            params: [
              Buffer.from(message).toString('hex'),
              walletKeysCoinbase?.hex,
            ],
          });
        return signature;
        // ⬆️ Note:A hex-encoded 129-byte array starting with 0x.
      } catch (e) {
        errorHandler(
          new Error('Coinbase signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysCoinbase?.hex],
  );

  return {
    walletKeysCoinbase,
    isCoinbaseInstalled,
    connectCoinbase,
    signArbitraryCoinbase,
    disconnectCoinbase,
  };
};

export const getCoinbaseFromWindow = async (): Promise<Ethereum> => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot get Coinbase without a window');
  }
  const coinbaseProvider = getProvider('isCoinbaseWallet');
  if (coinbaseProvider) {
    return coinbaseProvider;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Coinbase extension');
  }

  return new Promise<Ethereum>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        const coinbaseProvider = getProvider('isCoinbaseWallet');
        if (coinbaseProvider) {
          resolve(coinbaseProvider);
        } else {
          reject('Please install the Coinbase extension');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
