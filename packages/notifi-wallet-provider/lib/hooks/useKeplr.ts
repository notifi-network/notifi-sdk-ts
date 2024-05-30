import type { Keplr, StdSignature } from '@keplr-wallet/types';
import { useCallback, useEffect, useState } from 'react';

import { KeplrWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';

export const useKeplr = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeysKeplr, setWalletKeysKeplr] =
    useState<KeplrWalletKeys | null>(null);

  const [isKeplrInstalled, setIsKeplrInstalled] = useState<boolean>(false);

  const handleKeplrNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.keplr not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    loadingHandler(true);
    getKeplrFromWindow()
      .then((_keplr) => {
        setIsKeplrInstalled(true);
        // https://docs.keplr.app/api/#custom-event
        window.addEventListener('keplr_keystorechange', handleAccountChange);
      })
      .catch((e) => {
        setIsKeplrInstalled(false);
        console.error(e);
      })
      .finally(() => loadingHandler(false));

    const handleAccountChange = () => {
      if (!window.keplr) return handleKeplrNotExists('handleAccountChange');

      window.keplr.getKey('injective-1').then((key) => {
        // TODO: dynamic cosmos chain id
        const walletKeys = {
          bech32: key.bech32Address,
          base64: Buffer.from(key.pubKey).toString('base64'),
        };
        setWalletKeysKeplr(walletKeys);
      });
    };

    return () => {
      window.removeEventListener('keplr_keystorechange', handleAccountChange);
      loadingHandler(false);
    };
  }, []);

  const connectKeplr = async (
    // TODO: dynamic cosmos chain id (Rather than passing in the chainId to the function, it should be provided by the context provider level)
    chainId?: string,
  ): Promise<KeplrWalletKeys | null> => {
    if (!window.keplr) {
      handleKeplrNotExists('connectKeplr');
      return null;
    }
    loadingHandler(true);
    try {
      await window.keplr.enable(chainId ?? 'injective-1');
      const key = await window.keplr.getKey(chainId ?? 'injective-1');
      const walletKeys = {
        bech32: key.bech32Address,
        base64: Buffer.from(key.pubKey).toString('base64'),
      };
      selectWallet('keplr');
      setWalletKeysKeplr(walletKeys);
      setWalletKeysToLocalStorage('keplr', walletKeys);
      loadingHandler(false);
      return walletKeys;
    } catch (e) {
      errorHandler(
        new Error('Keplr connection failed, check console for details'),
      );
      console.error(e);
    }
    loadingHandler(false);
    return null;
  };

  const disconnectKeplr = () => {
    if (!window.keplr) return handleKeplrNotExists('disconnectKeplr');
    window.keplr.disable();
    setWalletKeysKeplr(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitraryKeplr = useCallback(
    async (
      message: string | Uint8Array,
      chainId?: string,
    ): Promise<StdSignature | undefined> => {
      if (!window.keplr || !walletKeysKeplr) {
        handleKeplrNotExists('signArbitraryKeplr');
        return;
      }
      loadingHandler(true);
      try {
        const result = await window.keplr.signArbitrary(
          chainId ?? 'injective-1',
          walletKeysKeplr?.bech32,
          message,
        );
        return result;
      } catch (e) {
        errorHandler(
          new Error('Wallet not signed. Please connect your wallet again.'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysKeplr],
  );
  return {
    isKeplrInstalled,
    walletKeysKeplr,
    connectKeplr,
    signArbitraryKeplr,
    disconnectKeplr,
  };
};

const getKeplrFromWindow = async (): Promise<Keplr> => {
  if (typeof window === 'undefined' || !window.keplr) {
    throw new Error(
      'Cannot get keplr without a window | Cannot get keplr from window',
    );
  }
  if (window.keplr) {
    return window.keplr;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Keplr extension');
  }
  return new Promise<Keplr>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.keplr) {
          resolve(window.keplr);
        } else {
          reject('Please install the Keplr extension');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
