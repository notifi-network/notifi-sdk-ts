import { useCallback, useEffect, useState } from 'react';

import { MidnightWalletKeys, Wallets } from '../types';
import {
  MidnightProvider,
  MidnightWalletAPI,
  MidnightWalletState,
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
  walletsWebsiteLink,
} from '../utils';

export type MidnightWalletHookType = {
  isMidnightInstalled: boolean;
  walletKeysMidnight: MidnightWalletKeys | null;
  connectMidnight: () => Promise<MidnightWalletKeys | null>;
  signArbitraryMidnight: (message: string) => Promise<string | undefined>;
  disconnectMidnight: () => void;
  websiteURL: string;
};

export const useMidnight = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
): MidnightWalletHookType => {
  const [walletKeysMidnight, setWalletKeysMidnight] =
    useState<MidnightWalletKeys | null>(null);

  const [isMidnightInstalled, setIsMidnightInstalled] = useState<boolean>(false);

  const handleMidnightNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.midnight.mnLace not initialized or not installed`,
      ),
    );
  };

  // Only detect wallet installation, don't auto-connect
  useEffect(() => {
    loadingHandler(true);
    getMidnightFromWindow()
      .then((midnight) => {
        setIsMidnightInstalled(true);
        // Note: Midnight doesn't have account change events like other wallets
        // This might be added in future versions of the wallet
      })
      .catch(() => {
        setIsMidnightInstalled(false);
      })
      .finally(() => loadingHandler(false));

    // Clean up function
    return () => {
      // No event listeners to clean up for Midnight yet
    };
  }, []);

  const connectMidnight = useCallback(async (): Promise<MidnightWalletKeys | null> => {
    if (!window.midnight?.mnLace) {
      handleMidnightNotExists('connectMidnight');
      return null;
    }

    loadingHandler(true);
    try {
      // Check if already enabled first (avoid unnecessary popups)
      const isEnabled = await window.midnight.mnLace.isEnabled();
      
      // Always call enable() but it won't show popup if already enabled
      const walletApi = await window.midnight.mnLace.enable();
      
      // Get wallet state
      const state: MidnightWalletState = await walletApi.state();
      
      if (!state.address) {
        throw new Error('No address returned from Midnight wallet');
      }

      // Create wallet keys based on the address format
      const walletKeys: MidnightWalletKeys = {
        bech32: state.address, // Primary Midnight address (Bech32m encoded)
        hex: state.address,    // For compatibility - may need conversion based on address type
      };

      setWalletKeysMidnight(walletKeys);
      setWalletKeysToLocalStorage({
        walletName: 'midnight',
        walletKeys,
      });
      selectWallet('midnight');

      return walletKeys;
    } catch (e) {
      console.error('Midnight wallet connection error:', e);
      errorHandler(
        new Error('Failed to connect Midnight wallet. Please try again.'),
      );
      return null;
    } finally {
      loadingHandler(false);
    }
  }, [loadingHandler, errorHandler, selectWallet]);

  const disconnectMidnight = useCallback(() => {
    setWalletKeysMidnight(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  }, [selectWallet]);

  const signArbitraryMidnight = useCallback(
    async (message: string): Promise<string | undefined> => {
      if (!window.midnight?.mnLace || !walletKeysMidnight) {
        handleMidnightNotExists('signArbitraryMidnight');
        return;
      }

      loadingHandler(true);
      try {
        const walletApi = await window.midnight.mnLace.enable();
        
        // signData is a required method in CIP-30, no need to check for undefined
        const result = await walletApi.signData(
          walletKeysMidnight.bech32,
          Buffer.from(message, 'utf8').toString('hex'),
        );
        
        return result.signature;
      } catch (e) {
        console.error('Midnight signing error:', e);
        errorHandler(
          new Error('Failed to sign message with Midnight wallet'),
        );
        return undefined;
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysMidnight, loadingHandler, errorHandler],
  );

  return {
    isMidnightInstalled,
    walletKeysMidnight,
    connectMidnight,
    signArbitraryMidnight,
    disconnectMidnight,
    websiteURL: walletsWebsiteLink['midnight'],
  };
};

const getMidnightFromWindow = async (): Promise<MidnightProvider> => {
  if (typeof window === 'undefined' || !window.midnight?.mnLace) {
    throw new Error(
      'Cannot get Midnight wallet without a window | Midnight wallet not found',
    );
  }
  
  // Return the Midnight provider
  return window.midnight.mnLace;
};