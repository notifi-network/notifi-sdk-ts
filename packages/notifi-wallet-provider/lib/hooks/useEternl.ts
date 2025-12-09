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

export type EternlWalletHookType = {
  isEternlInstalled: boolean;
  walletKeysEternl: LaceWalletKeys | null;
  connectEternl: () => Promise<LaceWalletKeys | null>;
  signArbitraryEternl: (
    message: string,
  ) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;
  disconnectEternl: () => void;
  websiteURL: string;
};

export const useEternl = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): EternlWalletHookType => {
  const [walletKeysEternl, setWalletKeysEternl] =
    useState<LaceWalletKeys | null>(null);

  const [isEternlInstalled, setIsEternlInstalled] = useState<boolean>(false);

  const handleEternlNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: Eternl wallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    let mounted = true;
    let pollingIntervalId: NodeJS.Timeout | null = null;

    const handleWalletDetected = () => {
      if (mounted) {
        setIsEternlInstalled(true);
        loadingHandler(false);
      }
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };

    const handleWalletNotFound = () => {
      if (mounted) {
        setIsEternlInstalled(false);
        loadingHandler(false);
      }
    };

    loadingHandler(true);

    // Primary method: Use getEternlFromWindow (event-driven, waits for document ready)
    getEternlFromWindow()
      .then(() => {
        handleWalletDetected();
      })
      .catch(() => {
        // Fallback: Start polling if getEternlFromWindow fails
        // Some wallets may inject after document.readyState === 'complete'
        let retryCount = 0;
        const maxRetries = 30; // Poll for 3 seconds (30 * 100ms)

        pollingIntervalId = setInterval(() => {
          retryCount++;
          if (window.cardano?.eternl) {
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

  const connectEternl =
    useCallback(async (): Promise<LaceWalletKeys | null> => {
      const eternlWallet = window.cardano?.eternl;

      if (!eternlWallet) {
        handleEternlNotExists('connectEternl');
        return null;
      }

      loadingHandler(true);
      try {
        const walletApi = await eternlWallet.enable();

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
          console.error(`ERROR: connectEternl - ${errMsg}`);
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

        setWalletKeysEternl(walletKeys);
        setWalletKeysToLocalStorage('eternl', walletKeys);
        selectWallet('eternl');

        return walletKeys;
      } catch (e) {
        console.error('Error connecting to Eternl wallet:', e);
        if (e instanceof Error) {
          errorHandler(e);
        }
        return null;
      } finally {
        loadingHandler(false);
      }
    }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectEternl = useCallback(() => {
    setWalletKeysEternl(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryEternl = useCallback(
    async (
      message: string,
    ): Promise<ReturnType<CIP30WalletAPI['signData']> | undefined> => {
      const eternlWallet = window.cardano?.eternl;

      if (!eternlWallet || !walletKeysEternl) {
        handleEternlNotExists('signArbitraryEternl');
        return undefined;
      }

      loadingHandler(true);
      try {
        const walletApi = await eternlWallet.enable();

        const messageHex = Buffer.from(message, 'utf8').toString('hex');

        const result = await walletApi.signData(
          walletKeysEternl.cbor,
          messageHex,
        );

        return result;
      } catch (error) {
        errorHandler(
          new Error(`Failed to sign message with Eternl wallet: ${error}`),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysEternl, loadingHandler, errorHandler],
  );

  return {
    isEternlInstalled,
    walletKeysEternl,
    connectEternl,
    signArbitraryEternl,
    disconnectEternl,
    websiteURL: walletsWebsiteLink['eternl'],
  };
};

// Detect if Eternl wallet is installed
// Uses event-driven approach to wait for document ready, more efficient
const getEternlFromWindow = async (): Promise<CIP30WalletInfo> => {
  // Check immediately if already exists
  if (window.cardano?.eternl) {
    return window.cardano.eternl;
  }

  // If page is fully loaded but wallet not found, throw error
  if (document.readyState === 'complete') {
    throw new Error('Eternl wallet not found');
  }

  // Wait for page to finish loading using event listener
  return new Promise<CIP30WalletInfo>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.cardano?.eternl) {
          resolve(window.cardano.eternl);
        } else {
          reject('Eternl wallet not found');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
