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

export type YoroiWalletHookType = {
  isYoroiInstalled: boolean;
  walletKeysYoroi: LaceWalletKeys | null;
  connectYoroi: () => Promise<LaceWalletKeys | null>;
  signArbitraryYoroi: (
    message: string,
  ) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;
  disconnectYoroi: () => void;
  websiteURL: string;
};

export const useYoroi = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): YoroiWalletHookType => {
  const [walletKeysYoroi, setWalletKeysYoroi] = useState<LaceWalletKeys | null>(
    null,
  );

  const [isYoroiInstalled, setIsYoroiInstalled] = useState<boolean>(false);

  const handleYoroiNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: Yoroi wallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    let mounted = true;
    let pollingIntervalId: NodeJS.Timeout | null = null;

    const handleWalletDetected = () => {
      if (mounted) {
        setIsYoroiInstalled(true);
        loadingHandler(false);
      }
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };

    const handleWalletNotFound = () => {
      if (mounted) {
        setIsYoroiInstalled(false);
        loadingHandler(false);
      }
    };

    loadingHandler(true);

    // Primary method: Use getYoroiFromWindow (event-driven, waits for document ready)
    getYoroiFromWindow()
      .then(() => {
        handleWalletDetected();
      })
      .catch(() => {
        // Fallback: Start polling if getYoroiFromWindow fails
        // Some wallets may inject after document.readyState === 'complete'
        let retryCount = 0;
        const maxRetries = 30; // Poll for 3 seconds (30 * 100ms)

        pollingIntervalId = setInterval(() => {
          retryCount++;
          if (window.cardano?.yoroi) {
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

  const connectYoroi = useCallback(async (): Promise<LaceWalletKeys | null> => {
    const yoroiWallet = window.cardano?.yoroi;

    if (!yoroiWallet) {
      handleYoroiNotExists('connectYoroi');
      return null;
    }

    loadingHandler(true);
    try {
      const walletApi = await yoroiWallet.enable();

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
        console.error(`ERROR: connectYoroi - ${errMsg}`);
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
        console.warn('⚠️ Failed to decode CBOR to bech32, using raw CBOR:', e);
      }

      const walletKeys: LaceWalletKeys = {
        bech32: bech32Address,
        cbor: cborAddress,
      };

      setWalletKeysYoroi(walletKeys);
      setWalletKeysToLocalStorage('yoroi', walletKeys);
      selectWallet('yoroi');

      return walletKeys;
    } catch (e) {
      console.error('Error connecting to Yoroi wallet:', e);
      if (e instanceof Error) {
        errorHandler(e);
      }
      return null;
    } finally {
      loadingHandler(false);
    }
  }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectYoroi = useCallback(() => {
    setWalletKeysYoroi(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryYoroi = useCallback(
    async (
      message: string,
    ): Promise<ReturnType<CIP30WalletAPI['signData']> | undefined> => {
      const yoroiWallet = window.cardano?.yoroi;

      if (!yoroiWallet || !walletKeysYoroi) {
        handleYoroiNotExists('signArbitraryYoroi');
        return undefined;
      }

      loadingHandler(true);
      try {
        const walletApi = await yoroiWallet.enable();

        const messageHex = Buffer.from(message, 'utf8').toString('hex');

        const result = await walletApi.signData(
          walletKeysYoroi.cbor,
          messageHex,
        );

        return result;
      } catch (error) {
        errorHandler(
          new Error(`Failed to sign message with Yoroi wallet: ${error}`),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysYoroi, loadingHandler, errorHandler],
  );

  return {
    isYoroiInstalled,
    walletKeysYoroi,
    connectYoroi,
    signArbitraryYoroi,
    disconnectYoroi,
    websiteURL: walletsWebsiteLink['yoroi'],
  };
};

// Detect if Yoroi wallet is installed
// Uses event-driven approach to wait for document ready, more efficient
const getYoroiFromWindow = async (): Promise<CIP30WalletInfo> => {
  // Check immediately if already exists
  if (window.cardano?.yoroi) {
    return window.cardano.yoroi;
  }

  // If page is fully loaded but wallet not found, throw error
  if (document.readyState === 'complete') {
    throw new Error('Yoroi wallet not found');
  }

  // Wait for page to finish loading using event listener
  return new Promise<CIP30WalletInfo>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.cardano?.yoroi) {
          resolve(window.cardano.yoroi);
        } else {
          reject('Yoroi wallet not found');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
