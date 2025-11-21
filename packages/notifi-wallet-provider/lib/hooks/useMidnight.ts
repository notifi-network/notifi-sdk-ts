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

  const [isMidnightInstalled, setIsMidnightInstalled] =
    useState<boolean>(false);

  const handleMidnightNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.midnight.mnLace not initialized or not installed`,
      ),
    );
  };

  // Temporary debug version with more flexible detection
  useEffect(() => {
    loadingHandler(true);

    // Enhanced detection logic - check for Lace wallet
    const checkMidnightWallet = () => {
      console.log('🔍 Debugging Midnight wallet detection...');
      console.log('window.cardano:', window.cardano);
      console.log('window.cardano?.lace:', window.cardano?.lace);

      // Primary check: Lace wallet via cardano interface
      if (window.cardano?.lace) {
        console.log(
          '✅ Found Lace wallet (Midnight support):',
          window.cardano.lace,
        );
        setIsMidnightInstalled(true);
        return true;
      }

      // Fallback check: Direct midnight interface
      if (window.midnight?.mnLace) {
        console.log(
          '✅ Found direct Midnight interface:',
          window.midnight.mnLace,
        );
        setIsMidnightInstalled(true);
        return true;
      }

      console.log('❌ No Midnight/Lace wallet interface found');
      setIsMidnightInstalled(false);
      return false;
    };

    // Run detection
    const detected = checkMidnightWallet();
    console.log('🎯 Final detection result:', detected);

    loadingHandler(false);

    // Clean up function
    return () => {
      // No event listeners to clean up for Midnight yet
    };
  }, []);

  const connectMidnight =
    useCallback(async (): Promise<MidnightWalletKeys | null> => {
      // Try to get Lace wallet first, then fallback to midnight interface
      const midnightWallet = window.cardano?.lace || window.midnight?.mnLace;

      if (!midnightWallet) {
        handleMidnightNotExists('connectMidnight');
        return null;
      }

      loadingHandler(true);
      try {
        console.log('🔗 Attempting to connect to Midnight wallet...');

        // Always call enable() to request permission - this will show the popup
        const walletApi = await midnightWallet.enable();
        console.log('✅ Wallet enabled successfully:', walletApi);

        // Try multiple methods to get addresses
        let accounts = [];

        try {
          // Method 1: Try getUsedAddresses first
          accounts = await walletApi.getUsedAddresses();
          console.log('📋 getUsedAddresses() result:', accounts);
        } catch (e) {
          console.log('⚠️ getUsedAddresses() failed:', e);
        }

        // Method 2: If no used addresses, try getUnusedAddresses
        if (!accounts || accounts.length === 0) {
          try {
            accounts = await walletApi.getUnusedAddresses();
            console.log('📋 getUnusedAddresses() result:', accounts);
          } catch (e) {
            console.log('⚠️ getUnusedAddresses() failed:', e);
          }
        }

        // Method 3: If still no addresses, try getChangeAddress
        if (!accounts || accounts.length === 0) {
          try {
            const changeAddress = await walletApi.getChangeAddress();
            if (changeAddress) {
              accounts = [changeAddress];
              console.log('📋 getChangeAddress() result:', changeAddress);
            }
          } catch (e) {
            console.log('⚠️ getChangeAddress() failed:', e);
          }
        }

        if (!accounts || accounts.length === 0) {
          throw new Error(
            'No addresses found in wallet. Please ensure your wallet has at least one address.',
          );
        }

        const bech32 = accounts[0];

        const walletKeys: MidnightWalletKeys = {
          bech32, // 只使用 Cardano 原生的 bech32 格式
        };

        console.log('🔑 Wallet keys generated:', walletKeys);

        setWalletKeysMidnight(walletKeys);
        setWalletKeysToLocalStorage('midnight', walletKeys);
        selectWallet('midnight');

        console.log('🎉 Midnight wallet connected successfully!');
        return walletKeys;
      } catch (error) {
        console.error('❌ Error connecting to Midnight wallet:', error);
        errorHandler(
          new Error(`Failed to connect to Midnight wallet: ${error}`),
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
      console.log('🔥 signArbitraryMidnight called with message:', message);

      // Use the same detection logic as connection
      const midnightWallet = window.cardano?.lace || window.midnight?.mnLace;

      if (!midnightWallet || !walletKeysMidnight) {
        console.error('❌ Midnight wallet or keys not available');
        console.log('midnightWallet:', midnightWallet);
        console.log('walletKeysMidnight:', walletKeysMidnight);
        handleMidnightNotExists('signArbitraryMidnight');
        return undefined;
      }

      loadingHandler(true);
      try {
        console.log('🔗 Getting wallet API...');
        const walletApi = await midnightWallet.enable();
        console.log('✅ Wallet API obtained:', walletApi);

        const messageHex = Buffer.from(message, 'utf8').toString('hex');
        console.log('📝 Message in hex:', messageHex);
        console.log('🔑 Using address:', walletKeysMidnight.bech32);

        // signData is a required method in CIP-30
        const result = await walletApi.signData(
          walletKeysMidnight.bech32,
          messageHex,
        );

        console.log('✅ Raw signature result:', result);

        // Handle different possible return formats
        let signature: string | undefined;
        if (typeof result === 'string') {
          signature = result;
        } else if (result && typeof result === 'object') {
          signature = result.signature || result.sig || result.data;
        }

        console.log('🎯 Final signature:', signature);
        return signature;
      } catch (error) {
        console.error('❌ Midnight signing error:', error);
        errorHandler(
          new Error(`Failed to sign message with Midnight wallet: ${error}`),
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
  if (typeof window === 'undefined') {
    throw new Error('Cannot get Midnight wallet without a window');
  }

  // Check for Lace wallet (which supports Midnight)
  if (window.cardano?.lace) {
    return window.cardano.lace;
  }

  // Fallback to original midnight interface
  if (window.midnight?.mnLace) {
    return window.midnight.mnLace;
  }

  throw new Error('Midnight wallet not found - please install Lace wallet');
};
