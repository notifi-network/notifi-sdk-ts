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

export type LaceWalletHookType = {
  isLaceInstalled: boolean;
  walletKeysLace: LaceWalletKeys | null;
  connectLace: () => Promise<LaceWalletKeys | null>;
  signArbitraryLace: (
    message: string,
  ) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;
  disconnectLace: () => void;
  websiteURL: string;
};

// NOTE: Lace wallet does not support account change events currently since the restriction of CIP-30.

export const useLace = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): LaceWalletHookType => {
  const [walletKeysLace, setWalletKeysLace] = useState<LaceWalletKeys | null>(
    null,
  );

  const [isLaceInstalled, setIsLaceInstalled] = useState<boolean>(false);

  const handleLaceNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: Lace wallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    let mounted = true;
    let pollingIntervalId: NodeJS.Timeout | null = null;

    const handleWalletDetected = () => {
      if (mounted) {
        setIsLaceInstalled(true);
        loadingHandler(false);
      }
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };

    const handleWalletNotFound = () => {
      if (mounted) {
        setIsLaceInstalled(false);
        loadingHandler(false);
      }
    };

    loadingHandler(true);

    // Primary method: Use getLaceFromWindow (event-driven, waits for document ready)
    getLaceFromWindow()
      .then(() => {
        handleWalletDetected();
      })
      .catch(() => {
        // Fallback: Start polling if getLaceFromWindow fails
        // Some wallets may inject after document.readyState === 'complete'
        let retryCount = 0;
        const maxRetries = 30; // Poll for 3 seconds (30 * 100ms)

        pollingIntervalId = setInterval(() => {
          retryCount++;
          if (window.cardano?.lace || window.midnight?.mnLace) {
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

  const connectLace = useCallback(async (): Promise<LaceWalletKeys | null> => {
    const laceWallet = window.cardano?.lace || window.midnight?.mnLace;

    if (!laceWallet) {
      handleLaceNotExists('connectLace');
      return null;
    }

    loadingHandler(true);
    try {
      const walletApi = await laceWallet.enable();

      let accounts: Cbor[] = [];

      // 1. Try to get used addresses
      try {
        if (walletApi.getUsedAddresses) {
          accounts = await walletApi.getUsedAddresses();
        }
      } catch (e) {
        console.warn('⚠️ getUsedAddresses() failed:', e);
      }

      // 2. If no used addresses, try to get unused addresses
      if (!accounts || accounts.length === 0) {
        try {
          if (walletApi.getUnusedAddresses) {
            accounts = await walletApi.getUnusedAddresses();
          }
        } catch (e) {
          console.warn('⚠️ getUnusedAddresses() failed:', e);
        }
      }

      // 3. If still no addresses, try to get change address
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

      // Final check for addresses
      if (!accounts || accounts.length === 0) {
        const errMsg =
          'No addresses found in wallet. Please ensure your wallet has at least one address.';
        const err = new Error(errMsg);
        errorHandler(err);
        console.error(`ERROR: connectLace - ${errMsg}`);
        return null;
      }

      const cborAddress = accounts[0];

      let bech32Address = cborAddress;
      try {
        // Decode CBOR to bech32
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

      setWalletKeysLace(walletKeys);
      setWalletKeysToLocalStorage('lace', walletKeys);
      selectWallet('lace');

      return walletKeys;
    } catch (e) {
      console.error('Error connecting to Lace wallet:', e);
      if (e instanceof Error) {
        errorHandler(e);
      }
      return null;
    } finally {
      loadingHandler(false);
    }
  }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectLace = useCallback(() => {
    setWalletKeysLace(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryLace = useCallback(
    async (
      message: string,
    ): Promise<ReturnType<CIP30WalletAPI['signData']> | undefined> => {
      const laceWallet = window.cardano?.lace || window.midnight?.mnLace;

      if (!laceWallet || !walletKeysLace) {
        handleLaceNotExists('signArbitraryLace');
        return undefined;
      }

      loadingHandler(true);
      try {
        const walletApi = await laceWallet.enable();

        const messageHex = Buffer.from(message, 'utf8').toString('hex');

        const result = await walletApi.signData(
          walletKeysLace.cbor,
          messageHex,
        );

        return result;
      } catch (error) {
        errorHandler(
          new Error(`Failed to sign message with Lace wallet: ${error}`),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysLace, loadingHandler, errorHandler],
  );

  return {
    isLaceInstalled,
    walletKeysLace,
    connectLace,
    signArbitraryLace,
    disconnectLace,
    websiteURL: walletsWebsiteLink['lace'],
  };
};

// Detect if Lace wallet is installed
// Uses event-driven approach to wait for document ready, more efficient
// Supports two locations: window.cardano.lace and window.midnight.mnLace
const getLaceFromWindow = async (): Promise<CIP30WalletInfo> => {
  // Check immediately if already exists (supports both locations)
  if (window.cardano?.lace) {
    return window.cardano.lace;
  }

  if (window.midnight?.mnLace) {
    return window.midnight.mnLace;
  }

  // If page is fully loaded but wallet not found, throw error
  if (document.readyState === 'complete') {
    throw new Error('Lace wallet not found');
  }

  // Wait for page to finish loading using event listener
  return new Promise<CIP30WalletInfo>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.cardano?.lace) {
          resolve(window.cardano.lace);
        } else if (window.midnight?.mnLace) {
          resolve(window.midnight.mnLace);
        } else {
          reject('Lace wallet not found');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
