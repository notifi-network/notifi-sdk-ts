import { useCallback, useEffect, useState } from 'react';

import { LaceWalletKeys, Wallets } from '../types';
import {
  CIP30WalletAPI,
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
    const checkLaceWallet = () => {
      if (window.cardano?.lace) {
        setIsLaceInstalled(true);
        return true;
      }

      if (window.midnight?.mnLace) {
        setIsLaceInstalled(true);
        return true;
      }

      setIsLaceInstalled(false);
      return false;
    };

    checkLaceWallet();
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
