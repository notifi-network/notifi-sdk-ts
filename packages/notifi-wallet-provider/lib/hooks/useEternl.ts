import { useCallback, useEffect, useState } from 'react';

import { LaceWalletKeys, Wallets } from '../types';
import {
  CIP30WalletAPI,
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
    const checkEternlWallet = () => {
      if (window.cardano?.eternl) {
        setIsEternlInstalled(true);
        return true;
      }

      setIsEternlInstalled(false);
      return false;
    };

    checkEternlWallet();
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
