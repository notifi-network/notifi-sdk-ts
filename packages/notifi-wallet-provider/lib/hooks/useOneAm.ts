import { Buffer } from 'buffer';
import { useCallback, useEffect, useState } from 'react';

import { CardanoWalletKeys, Wallets } from '../types';
import {
  CIP30WalletAPI,
  CIP30WalletInfo,
  Cbor,
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
  walletsWebsiteLink,
} from '../utils';

export type OneAmWalletHookType = {
  isOneAmInstalled: boolean;
  walletKeysOneAm: CardanoWalletKeys | null;
  connectOneAm: () => Promise<CardanoWalletKeys | null>;
  signArbitraryOneAm: (
    message: string,
  ) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;
  disconnectOneAm: () => void;
  websiteURL: string;
};

export const useOneAm = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): OneAmWalletHookType => {
  const [walletKeysOneAm, setWalletKeysOneAm] =
    useState<CardanoWalletKeys | null>(null);

  const [isOneAmInstalled, setIsOneAmInstalled] = useState<boolean>(false);

  const handleOneAmNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: 1AM wallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    let mounted = true;
    let pollingIntervalId: NodeJS.Timeout | null = null;

    const handleWalletDetected = () => {
      if (mounted) {
        setIsOneAmInstalled(true);
        loadingHandler(false);
      }
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };

    const handleWalletNotFound = () => {
      if (mounted) {
        setIsOneAmInstalled(false);
        loadingHandler(false);
      }
    };

    loadingHandler(true);

    // Primary method: Use getOneAmFromWindow (event-driven, waits for document ready)
    getOneAmFromWindow()
      .then(() => {
        handleWalletDetected();
      })
      .catch(() => {
        // Fallback: Start polling if getOneAmFromWindow fails
        // Some wallets may inject after document.readyState === 'complete'
        let retryCount = 0;
        const maxRetries = 30; // Poll for 3 seconds (30 * 100ms)

        pollingIntervalId = setInterval(() => {
          retryCount++;
          if (window.cardano?.['1am']) {
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

  const connectOneAm =
    useCallback(async (): Promise<CardanoWalletKeys | null> => {
      const oneAmWallet = window.cardano?.['1am'];

      if (!oneAmWallet) {
        handleOneAmNotExists('connectOneAm');
        return null;
      }

      loadingHandler(true);
      try {
        const walletApi = await oneAmWallet.enable();

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
          console.error(`ERROR: connectOneAm - ${errMsg}`);
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

        const walletKeys: CardanoWalletKeys = {
          bech32: bech32Address,
          cbor: cborAddress,
        };

        setWalletKeysOneAm(walletKeys);
        setWalletKeysToLocalStorage('1am', walletKeys);
        selectWallet('1am');

        return walletKeys;
      } catch (e) {
        console.error('Error connecting to 1AM wallet:', e);
        if (e instanceof Error) {
          errorHandler(e);
        }
        return null;
      } finally {
        loadingHandler(false);
      }
    }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectOneAm = useCallback(() => {
    setWalletKeysOneAm(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryOneAm = useCallback(
    async (
      message: string,
    ): Promise<ReturnType<CIP30WalletAPI['signData']> | undefined> => {
      const oneAmWallet = window.cardano?.['1am'];

      if (!oneAmWallet || !walletKeysOneAm) {
        handleOneAmNotExists('signArbitraryOneAm');
        return undefined;
      }

      loadingHandler(true);
      try {
        const walletApi = await oneAmWallet.enable();

        const messageHex = Buffer.from(message, 'utf8').toString('hex');

        const result = await walletApi.signData(
          walletKeysOneAm.cbor,
          messageHex,
        );

        return result;
      } catch (error) {
        errorHandler(
          new Error(`Failed to sign message with 1AM wallet: ${error}`),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysOneAm, loadingHandler, errorHandler],
  );

  return {
    isOneAmInstalled,
    walletKeysOneAm,
    connectOneAm,
    signArbitraryOneAm,
    disconnectOneAm,
    websiteURL: walletsWebsiteLink['1am'],
  };
};

// Detect if 1AM wallet is installed
// Uses event-driven approach to wait for document ready, more efficient
const getOneAmFromWindow = async (): Promise<CIP30WalletInfo> => {
  // Check immediately if already exists
  if (window.cardano?.['1am']) {
    return window.cardano['1am'];
  }

  // If page is fully loaded but wallet not found, throw error
  if (document.readyState === 'complete') {
    throw new Error('1AM wallet not found');
  }

  // Wait for page to finish loading using event listener
  return new Promise<CIP30WalletInfo>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.cardano?.['1am']) {
          resolve(window.cardano['1am']);
        } else {
          reject('1AM wallet not found');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
