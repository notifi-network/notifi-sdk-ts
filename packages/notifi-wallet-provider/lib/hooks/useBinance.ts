import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { BinanceChain, MetamaskWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  defaultValue,
  setWalletKeysToLocalStorage,
  walletsWebsiteLink,
} from '../utils';

const walletName: keyof Wallets = 'binance';

export const useBinance = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  options?: { cosmosChainPrefix?: string },
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
      .catch(() => {
        setIsWalletInstalled(false);
      });
  }, []);

  useEffect(() => {
    setIsWalletInstalled(!!provider); // TODO: Test and see if can be removed

    if (!provider) return;

    const handleAccountChange = () => {
      provider.requestAccounts().then((response) => {
        const address = response?.[0]?.addresses?.find((v) => v.type === 'eth')
          ?.address as string;

        const walletKeys = {
          bech32: converter(
            options?.cosmosChainPrefix ?? defaultValue.cosmosChainPrefix,
          ).toBech32(address),
          hex: address,
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

    try {
      const response: { addresses: { type: string; address: string }[] }[] =
        await provider.requestAccounts();
      const address = response?.[0]?.addresses?.find((v) => v.type === 'eth')
        ?.address as string;

      const walletKeys = {
        bech32: converter(
          options?.cosmosChainPrefix ?? defaultValue.cosmosChainPrefix,
        ).toBech32(address),
        hex: address,
      };

      selectWallet(walletName);
      setWalletKeys(walletKeys);
      setWalletKeysToLocalStorage(walletName as keyof Wallets, walletKeys);
      return walletKeys;
    } catch (e) {
      console.error(e);
      disconnectWallet();
      if (e instanceof Error && e.message) {
        errorHandler(new Error(e.message));
      }
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
  const sendTransaction = async (
    transaction: object,
  ): Promise<`0x${string}` | undefined> => {
    let txHash: string | undefined;
    if (!provider || !walletKeys) {
      handleWalletNotExists('Sign Arbitrary');
      return;
    }
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
    if (txHash && txHash.startsWith('0x')) {
      return txHash as `0x${string}`;
    }
    return undefined;
  };

  return {
    walletKeys,
    isWalletInstalled,
    connectWallet,
    signArbitrary,
    disconnectWallet,
    websiteURL: walletsWebsiteLink[walletName],
    sendTransaction,
  };
};

export type BinanceWalletHookType = ReturnType<typeof useBinance>;

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
