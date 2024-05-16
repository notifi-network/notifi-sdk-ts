import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
import { Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';
import { Connection, PublicKey } from '@solana/web3.js';
import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import {
  PhantomWallet,
  PhantomWalletKeys,
  WalletKeys,
  Wallets,
} from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const usePhantom = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeysPhantom, setWalletKeysPhantom] =
    useState<PhantomWalletKeys | null>(null);

  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean>(false);

  const handlePhantomNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.phantom not initialized or not installed`,
      ),
    );
  };

  const connectPhantom =
    useCallback(async (): Promise<PhantomWalletKeys | null> => {
      if (!window.solana) {
        return null;
      }

      if (!injectivePhantomWallet.strategies.phantom) {
        return null;
      }

      loadingHandler(true);

      try {
        injectivePhantomWallet.setWallet(Wallet.Phantom);

        const accounts = await injectivePhantomWallet.getAddresses();

        const walletKeys = {
          bech32: converter('inj').toBech32(accounts[0]),
          hex: accounts[0],
        };

        selectWallet('phantom');
        setWalletKeysPhantom(walletKeys);
        setWalletKeysToLocalStorage('phantom', walletKeys);
        loadingHandler(false);
        return walletKeys;
      } catch (e) {
        errorHandler(
          new Error('Phantom connection failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
      return null;
    }, [selectWallet, errorHandler]);

  const disconnectPhantom = useCallback(async () => {
    if (!injectivePhantomWallet.strategies?.phantom) {
      return handlePhantomNotExists('disconnectPhantom');
    }
    injectivePhantomWallet.disconnect();
    selectWallet(null);
    setWalletKeysPhantom(null);
    cleanWalletsInLocalStorage();
  }, []);

  const injectivePhantomWallet = new WalletStrategy({
    chainId: ChainId.Mainnet,
    ethereumOptions: {
      ethereumChainId: EthereumChainId.Mainnet,
    },
    wallet: Wallet.Phantom,
  });

  const signArbitraryPhantom = useCallback(
    async (message: string): Promise<string | void> => {
      if (!walletKeysPhantom || !injectivePhantomWallet.strategies.phantom) {
        return;
      }
      loadingHandler(true);
      try {
        const accounts = await injectivePhantomWallet.getAddresses();
        const result = await injectivePhantomWallet.signArbitrary(
          accounts[0],
          message,
        );
        return result;
      } catch (e) {
        errorHandler(
          new Error('Phantom signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysPhantom],
  );

  return {
    isPhantomInstalled,
    walletKeysPhantom,
    connectPhantom,
    signArbitraryPhantom,
    disconnectPhantom,
    websiteURL: walletsWebsiteLink['phantom'],
  };
};
