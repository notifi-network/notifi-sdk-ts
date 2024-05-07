import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { BinanceChain, MetamaskWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';

const walletName: keyof Wallets = 'binance';

export const useBinance = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [provider, setProvider] = useState<BinanceChain>();

  const handleWalletNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: ${walletName} not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    geBinanceFromWindow()
      .then((bnb) => setProvider(bnb))
      .catch((e) => {
        console.error(e);
      });
  }, []);

  useEffect(() => {
    setIsWalletInstalled(!!provider);

    if (!provider) return;

    const handleAccountChange = () => {
      provider
        .requestAccounts()
        .then(
          (response: { addresses: { type: string; address: string }[] }[]) => {
            const address = response?.[0]?.addresses?.find(
              (v) => v.type === 'eth',
            )?.address as string;

            const walletKeys = {
              bech32: converter('inj').toBech32(address), // TODO: dynamic cosmos chain addr conversion
              hex: address,
            };

            setWalletKeys(walletKeys);
          },
        );
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
      handleWalletNotExists('connectWallet');
      return null;
    }

    loadingHandler(true);
    const timer = setTimeout(() => {
      disconnectWallet();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    try {
      const response: { addresses: { type: string; address: string }[] }[] =
        await provider.requestAccounts();
      const address = response?.[0]?.addresses?.find((v) => v.type === 'eth')
        ?.address as string;

      const walletKeys = {
        bech32: converter('inj').toBech32(address), // TODO: dynamic cosmos chain addr conversion
        hex: address,
      };

      selectWallet(walletName);
      setWalletKeys(walletKeys);
      setWalletKeysToLocalStorage(walletName as keyof Wallets, walletKeys);
      return walletKeys;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      disconnectWallet();
      e.message && errorHandler(new Error(e.message));
      return null;
    } finally {
      loadingHandler(false);
      clearTimeout(timer);
    }
  };

  const disconnectWallet = () => {
    setWalletKeys(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitrary = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      if (!provider || !walletKeys) {
        handleWalletNotExists('signArbitrary');
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      try {
        const signature: Promise<`0x${string}`> = await provider.request?.({
          method: 'personal_sign',
          params: [
            Buffer.from(message).toString('hex'),
            /** ⬆️
             * hex-encoded UTF-8 string to present to the user. See how to encode a string like this in the browser-string-hexer module.
             * @ref https://docs.metamask.io/wallet/reference/personal_sign/
             */
            walletKeys?.hex,
          ],
        });

        return signature;
        // ⬆️ Note:A hex-encoded 129-byte array starting with 0x.
      } catch (e) {
        errorHandler(
          new Error(
            `${walletName}'s signArbitrary failed, check console for details`,
          ),
        );
        console.error(e);
      } finally {
        loadingHandler(false);
        clearTimeout(timer);
      }
    },
    [walletKeys?.hex],
  );

  return {
    walletKeys,
    isWalletInstalled,
    connectWallet,
    signArbitrary,
    disconnectWallet,
  };
};

const geBinanceFromWindow = async (): Promise<BinanceChain> => {
  if (typeof window === 'undefined' || !window.BinanceChain) {
    throw new Error(
      `Cannot get ${walletName} without a window | Cannot get ${walletName} from window`,
    );
  }

  if (window.BinanceChain) {
    return window.BinanceChain;
  } else if (document.readyState === 'complete') {
    throw new Error(`Please install the ${walletName} extension`);
  }

  return new Promise<BinanceChain>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.BinanceChain) {
          resolve(window.BinanceChain);
        } else {
          reject(`Please install the ${walletName} extension`);
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
