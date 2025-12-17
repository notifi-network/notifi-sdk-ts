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

export type NufiWalletHookType = {
  isNufiInstalled: boolean;
  walletKeysNufi: LaceWalletKeys | null;
  connectNufi: () => Promise<LaceWalletKeys | null>;
  signArbitraryNufi: (
    message: string,
  ) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;
  disconnectNufi: () => void;
  websiteURL: string;
};

export const useNufi = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): NufiWalletHookType => {
  const [walletKeysNufi, setWalletKeysNufi] = useState<LaceWalletKeys | null>(
    null,
  );

  const [isNufiInstalled, setIsNufiInstalled] = useState<boolean>(false);

  const handleNufiNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: Nufi wallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    let mounted = true;
    let pollingIntervalId: NodeJS.Timeout | null = null;

    const handleWalletDetected = () => {
      if (mounted) {
        setIsNufiInstalled(true);
        loadingHandler(false);
      }
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };

    const handleWalletNotFound = () => {
      if (mounted) {
        setIsNufiInstalled(false);
        loadingHandler(false);
      }
    };

    loadingHandler(true);

    // Primary method: Use getNufiFromWindow (event-driven, waits for document ready)
    getNufiFromWindow()
      .then(() => {
        handleWalletDetected();
      })
      .catch(() => {
        // Fallback: Start polling if getNufiFromWindow fails
        // Some wallets may inject after document.readyState === 'complete'
        let retryCount = 0;
        const maxRetries = 30; // Poll for 3 seconds (30 * 100ms)

        pollingIntervalId = setInterval(() => {
          retryCount++;
          if (window.cardano?.nufi) {
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

  const connectNufi = useCallback(async (): Promise<LaceWalletKeys | null> => {
    const nufiWallet = window.cardano?.nufi;

    if (!nufiWallet) {
      handleNufiNotExists('connectNufi');
      return null;
    }

    loadingHandler(true);
    try {
      const walletApi = await nufiWallet.enable();

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
        console.error(`ERROR: connectNufi - ${errMsg}`);
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

      setWalletKeysNufi(walletKeys);
      setWalletKeysToLocalStorage('nufi', walletKeys);
      selectWallet('nufi');

      return walletKeys;
    } catch (e) {
      console.error('Error connecting to Nufi wallet:', e);
      if (e instanceof Error) {
        errorHandler(e);
      }
      return null;
    } finally {
      loadingHandler(false);
    }
  }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectNufi = useCallback(() => {
    setWalletKeysNufi(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryNufi = useCallback(
    async (
      message: string,
    ): Promise<ReturnType<CIP30WalletAPI['signData']> | undefined> => {
      const nufiWallet = window.cardano?.nufi;

      if (!nufiWallet || !walletKeysNufi) {
        handleNufiNotExists('signArbitraryNufi');
        return undefined;
      }

      loadingHandler(true);
      try {
        const walletApi = await nufiWallet.enable();

        const messageHex = Buffer.from(message, 'utf8').toString('hex');

        const result = await walletApi.signData(
          walletKeysNufi.cbor,
          messageHex,
        );

        return result;
      } catch (error) {
        errorHandler(
          new Error(`Failed to sign message with Nufi wallet: ${error}`),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysNufi, loadingHandler, errorHandler],
  );

  return {
    isNufiInstalled,
    walletKeysNufi,
    connectNufi,
    signArbitraryNufi,
    disconnectNufi,
    websiteURL: walletsWebsiteLink['nufi'],
  };
};

// Detect if Nufi wallet is installed
// Uses event-driven approach to wait for document ready, more efficient
const getNufiFromWindow = async (): Promise<CIP30WalletInfo> => {
  // Check immediately if already exists
  if (window.cardano?.nufi) {
    return window.cardano.nufi;
  }

  // If page is fully loaded but wallet not found, throw error
  if (document.readyState === 'complete') {
    throw new Error('Nufi wallet not found');
  }

  // Wait for page to finish loading using event listener
  return new Promise<CIP30WalletInfo>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.cardano?.nufi) {
          resolve(window.cardano.nufi);
        } else {
          reject('Nufi wallet not found');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
