import { useWallet } from '@solana/wallet-adapter-react';
import type { SolanaSignInInput } from '@solana/wallet-standard-features';
import bs58 from 'bs58';
import { useCallback, useEffect, useState } from 'react';

import { EVMChains } from '../context/NotifiWallets';
import { BackpackWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const useBackpack = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  selectedChain: 'solana' | EVMChains,
) => {
  const getProvider = () => {
    if ('backpack' in window) {
      const provider: any = window.backpack;
      if (provider?.isBackpack) {
        return provider;
      }
    }
  };

  const [walletKeysBackpack, setWalletKeysBackpack] =
    useState<BackpackWalletKeys | null>(null);

  const [isBackpackInstalled, setIsBackpackInstalled] =
    useState<boolean>(false);

  useEffect(() => {
    setIsBackpackInstalled(!!window.backpack);
  }, []);

  const handleBackpackNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.backpack not initialized or not installed`,
      ),
    );
  };

  const connectBackpack =
    useCallback(async (): Promise<BackpackWalletKeys | null> => {
      if (!window.backpack) {
        return null;
      }

      loadingHandler(true);

      try {
        const provider = getProvider();
        if (!provider) {
          throw new Error('Backpack provider not found');
        }

        const { publicKey } = await window.backpack.solana.connect();

        const walletKeys: BackpackWalletKeys = {
          base58: publicKey.toBase58(),
          hex: Buffer.from(bs58.decode(publicKey.toBase58())).toString('hex'),
          bech32: '',
        };

        selectWallet('backpack');
        setWalletKeysBackpack(walletKeys);
        setWalletKeysToLocalStorage('backpack', walletKeys);
        loadingHandler(false);
        return walletKeys;
      } catch (e) {
        errorHandler(
          new Error('Backpack connection failed, check console for details'),
        );
      }

      loadingHandler(false);
      return null;
    }, [selectWallet, errorHandler]);

  const disconnectBackpack = useCallback(async () => {
    if (!window.backpack) {
      return handleBackpackNotExists('disconnectBackpack');
    }
    window.backpack.disconnect();
    selectWallet(null);
    setWalletKeysBackpack(null);
    cleanWalletsInLocalStorage();
  }, []);

  const signArbitraryBackpack = useCallback(
    async (message: string): Promise<string | void> => {
      if (!walletKeysBackpack) {
        return;
      }
      loadingHandler(true);
      try {
        const provider = getProvider();
        if (!provider) {
          throw new Error('Backpack provider not found');
        }
        const messageBuffer = Buffer.from(message, 'utf-8');
        console.log('logging provider');
        console.log(provider);
        console.log(provider.connection);
        // const signedMessage = await provider.request({
        //   method: 'signMessage',
        //   params: {
        //     message: messageBuffer,
        //     display: 'hex',
        //   },
        // });
        const signedMessage = await provider.signMessage('hello');

        return signedMessage.signature;
      } catch (e) {
        errorHandler(
          new Error('Backpack signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysBackpack],
  );

  return {
    isBackpackInstalled,
    walletKeysBackpack,
    connectBackpack,
    signArbitraryBackpack,
    disconnectBackpack,
    websiteURL: walletsWebsiteLink['backpack'],
  };
};
