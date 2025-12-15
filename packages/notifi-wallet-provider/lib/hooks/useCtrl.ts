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

export type CtrlWalletHookType = {
  isCtrlInstalled: boolean;
  walletKeysCtrl: LaceWalletKeys | null;
  connectCtrl: () => Promise<LaceWalletKeys | null>;
  signArbitraryCtrl: (
    message: string,
  ) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;
  disconnectCtrl: () => void;
  websiteURL: string;
};

export const useCtrl = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): CtrlWalletHookType => {
  const [walletKeysCtrl, setWalletKeysCtrl] = useState<LaceWalletKeys | null>(
    null,
  );

  const [isCtrlInstalled, setIsCtrlInstalled] = useState<boolean>(false);

  const handleCtrlNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: CTRL wallet not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    let mounted = true;
    let pollingIntervalId: NodeJS.Timeout | null = null;

    const handleWalletDetected = () => {
      if (mounted) {
        setIsCtrlInstalled(true);
        loadingHandler(false);
      }
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };

    const handleWalletNotFound = () => {
      if (mounted) {
        setIsCtrlInstalled(false);
        loadingHandler(false);
      }
    };

    loadingHandler(true);

    // Primary method: Use getCtrlFromWindow (event-driven, waits for document ready)
    getCtrlFromWindow()
      .then(() => {
        handleWalletDetected();
      })
      .catch(() => {
        // Fallback: Start polling if getCtrlFromWindow fails
        // Some wallets may inject after document.readyState === 'complete'
        let retryCount = 0;
        const maxRetries = 30; // Poll for 3 seconds (30 * 100ms)

        pollingIntervalId = setInterval(() => {
          retryCount++;
          if (window.cardano?.ctrl) {
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

  const connectCtrl = useCallback(async (): Promise<LaceWalletKeys | null> => {
    const ctrlWallet = window.cardano?.ctrl;

    if (!ctrlWallet) {
      handleCtrlNotExists('connectCtrl');
      return null;
    }

    loadingHandler(true);
    try {
      const walletApi = await ctrlWallet.enable();

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
        console.error(`ERROR: connectCtrl - ${errMsg}`);
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

      setWalletKeysCtrl(walletKeys);
      setWalletKeysToLocalStorage('ctrl', walletKeys);
      selectWallet('ctrl');

      return walletKeys;
    } catch (e) {
      console.error('Error connecting to CTRL wallet:', e);
      if (e instanceof Error) {
        errorHandler(e);
      }
      return null;
    } finally {
      loadingHandler(false);
    }
  }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectCtrl = useCallback(() => {
    setWalletKeysCtrl(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryCtrl = useCallback(
    async (
      message: string,
    ): Promise<ReturnType<CIP30WalletAPI['signData']> | undefined> => {
      const ctrlWallet = window.cardano?.ctrl;

      if (!ctrlWallet || !walletKeysCtrl) {
        handleCtrlNotExists('signArbitraryCtrl');
        return undefined;
      }

      loadingHandler(true);
      try {
        const walletApi = await ctrlWallet.enable();

        const messageHex = Buffer.from(message, 'utf8').toString('hex');

        const result = await walletApi.signData(
          walletKeysCtrl.cbor,
          messageHex,
        );

        return result;
      } catch (error) {
        errorHandler(
          new Error(`Failed to sign message with CTRL wallet: ${error}`),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysCtrl, loadingHandler, errorHandler],
  );

  return {
    isCtrlInstalled,
    walletKeysCtrl,
    connectCtrl,
    signArbitraryCtrl,
    disconnectCtrl,
    websiteURL: walletsWebsiteLink['ctrl'],
  };
};

// Detect if CTRL wallet is installed
// Uses event-driven approach to wait for document ready, more efficient
const getCtrlFromWindow = async (): Promise<CIP30WalletInfo> => {
  // Check immediately if already exists
  if (window.cardano?.ctrl) {
    return window.cardano.ctrl;
  }

  // If page is fully loaded but wallet not found, throw error
  if (document.readyState === 'complete') {
    throw new Error('CTRL wallet not found');
  }

  // Wait for page to finish loading using event listener
  return new Promise<CIP30WalletInfo>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.cardano?.ctrl) {
          resolve(window.cardano.ctrl);
        } else {
          reject('CTRL wallet not found');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
