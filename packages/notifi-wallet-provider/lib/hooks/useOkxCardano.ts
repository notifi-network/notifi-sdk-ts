import { useCallback, useEffect, useState } from 'react';

import { LaceWalletKeys, Wallets } from '../types';
import {
  CIP30WalletAPI,
  CIP30WalletInfo,
  Cbor,
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
  walletsWebsiteLink,
} from '../utils';

export type OkxCardanoWalletHookType = {
  isOkxCardanoInstalled: boolean;
  walletKeysOkxCardano: LaceWalletKeys | null;
  connectOkxCardano: () => Promise<LaceWalletKeys | null>;
  signArbitraryOkxCardano: (
    message: string,
  ) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;
  disconnectOkxCardano: () => void;
  websiteURL: string;
};

export const useOkxCardano = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): OkxCardanoWalletHookType => {
  const [walletKeysOkxCardano, setWalletKeysOkxCardano] =
    useState<LaceWalletKeys | null>(null);

  const [isOkxCardanoInstalled, setIsOkxCardanoInstalled] =
    useState<boolean>(false);

  const handleOkxCardanoNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: OKX Cardano wallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    let mounted = true;
    let pollingIntervalId: NodeJS.Timeout | null = null;

    const handleWalletDetected = () => {
      if (mounted) {
        setIsOkxCardanoInstalled(true);
        loadingHandler(false);
      }
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };

    const handleWalletNotFound = () => {
      if (mounted) {
        setIsOkxCardanoInstalled(false);
        loadingHandler(false);
      }
    };

    loadingHandler(true);

    // Primary method: Use getOkxCardanoFromWindow (event-driven, waits for document ready)
    getOkxCardanoFromWindow()
      .then(() => {
        handleWalletDetected();
      })
      .catch(() => {
        // Fallback: Start polling if getOkxCardanoFromWindow fails
        // Some wallets may inject after document.readyState === 'complete'
        let retryCount = 0;
        const maxRetries = 30; // Poll for 3 seconds (30 * 100ms)

        pollingIntervalId = setInterval(() => {
          retryCount++;
          if (window.cardano?.okxwallet) {
            handleWalletDetected();
          } else if (retryCount >= maxRetries) {
            if (pollingIntervalId) clearInterval(pollingIntervalId);
            handleWalletNotFound();
          }
        }, 100);
      });

    return () => {
      mounted = false;
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
      loadingHandler(false);
    };
  }, []);

  const connectOkxCardano =
    useCallback(async (): Promise<LaceWalletKeys | null> => {
      const okxCardanoWallet = window.cardano?.okxwallet;

      if (!okxCardanoWallet) {
        handleOkxCardanoNotExists('connectOkxCardano');
        return null;
      }

      loadingHandler(true);
      try {
        const walletApi = await okxCardanoWallet.enable();

        let accounts: Cbor[] = [];

        try {
          if (walletApi.getUsedAddresses) {
            accounts = await walletApi.getUsedAddresses();
          }
        } catch (e) {
          console.warn('⚠️ getUsedAddresses() failed:', e);
        }

        if (!accounts || accounts.length === 0) {
          try {
            if (walletApi.getUnusedAddresses) {
              accounts = await walletApi.getUnusedAddresses();
            }
          } catch (e) {
            console.warn('⚠️ getUnusedAddresses() failed:', e);
          }
        }

        if (!accounts || accounts.length === 0) {
          try {
            if (walletApi.getChangeAddress) {
              const changeAddress = await walletApi.getChangeAddress();
              if (changeAddress) {
                accounts = [changeAddress];
              }
            }
          } catch (e) {
            console.warn('⚠️ getChangeAddress() failed:', e);
          }
        }

        if (!accounts || accounts.length === 0) {
          const errMsg =
            'No addresses found in wallet. Please ensure your wallet has at least one address.';
          const err = new Error(errMsg);
          errorHandler(err);
          console.error(`ERROR: connectOkxCardano - ${errMsg}`);
          return null;
        }

        const cborAddress = accounts[0];

        let bech32Address = cborAddress;
        try {
          const { bech32 } = await import('bech32');
          const buffer = Buffer.from(cborAddress, 'hex');
          const words = bech32.toWords(buffer);
          bech32Address = bech32.encode('addr', words, 1000);
        } catch (e) {
          console.warn(
            '⚠️ Failed to decode CBOR to bech32, using raw CBOR:',
            e,
          );
        }

        const walletKeys: LaceWalletKeys = {
          bech32: bech32Address,
          cbor: cborAddress,
        };

        setWalletKeysOkxCardano(walletKeys);
        setWalletKeysToLocalStorage('okx-cardano', walletKeys);
        selectWallet('okx-cardano');

        return walletKeys;
      } catch (e) {
        console.error('Error connecting to OKX Cardano wallet:', e);
        if (e instanceof Error) {
          errorHandler(e);
        }
        return null;
      } finally {
        loadingHandler(false);
      }
    }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectOkxCardano = useCallback(() => {
    setWalletKeysOkxCardano(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryOkxCardano = useCallback(
    async (
      message: string,
    ): Promise<ReturnType<CIP30WalletAPI['signData']> | undefined> => {
      const okxCardanoWallet = window.cardano?.okxwallet;

      if (!okxCardanoWallet || !walletKeysOkxCardano) {
        handleOkxCardanoNotExists('signArbitraryOkxCardano');
        return undefined;
      }

      loadingHandler(true);
      try {
        const walletApi = await okxCardanoWallet.enable();

        const messageHex = Buffer.from(message, 'utf8').toString('hex');

        const result = await walletApi.signData(
          walletKeysOkxCardano.cbor,
          messageHex,
        );

        return result;
      } catch (error) {
        errorHandler(
          new Error(`Failed to sign message with OKX Cardano wallet: ${error}`),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysOkxCardano, loadingHandler, errorHandler],
  );

  return {
    isOkxCardanoInstalled,
    walletKeysOkxCardano,
    connectOkxCardano,
    signArbitraryOkxCardano,
    disconnectOkxCardano,
    websiteURL: walletsWebsiteLink['okx-cardano'],
  };
};

// Detect if OKX Cardano wallet is installed
// Uses event-driven approach to wait for document ready, more efficient
const getOkxCardanoFromWindow = async (): Promise<CIP30WalletInfo> => {
  // Check immediately if already exists
  if (window.cardano?.okxwallet) {
    return window.cardano.okxwallet;
  }

  // If page is fully loaded but wallet not found, throw error
  if (document.readyState === 'complete') {
    throw new Error('OKX Cardano wallet not found');
  }

  // Wait for page to finish loading using event listener
  return new Promise<CIP30WalletInfo>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.cardano?.okxwallet) {
          resolve(window.cardano.okxwallet);
        } else {
          reject('OKX Cardano wallet not found');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
