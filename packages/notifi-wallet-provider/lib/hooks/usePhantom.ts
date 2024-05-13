import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
import { Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';
import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { PhantomWalletKeys, WalletKeys, Wallets } from '../types';
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

  useEffect(() => {
    loadingHandler(true);
    checkPhantomInstalled()
      .then((installed) => {
        setIsPhantomInstalled(installed);
        if (installed && window.phantom?.ethereum) {
          window.phantom.ethereum.on('connect', handleConnect);
          window.phantom.ethereum.on('disconnect', handleDisconnect);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => loadingHandler(false));

    return () => {
      if (window.phantom?.ethereum) {
        window.phantom.ethereum.off('connect', handleConnect);
        window.phantom.ethereum.off('disconnect', handleDisconnect);
      }
      loadingHandler(false);
    };
  }, []);

  const checkPhantomInstalled = async (): Promise<boolean> => {
    const provider = getProvider();
    if (provider) {
      try {
        await provider.connect();
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const getProvider = () => {
    if ('phantom' in window) {
      const anyWindow: any = window;
      const provider = anyWindow.phantom?.ethereum;

      if (provider) {
        return provider;
      }
    }

    window.open('https://phantom.app/', '_blank');
  };

  const connectPhantom =
    useCallback(async (): Promise<PhantomWalletKeys | null> => {
      const provider = getProvider();

      if (!provider) {
        return null;
      }

      loadingHandler(true);

      try {
        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });

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

  const handleConnect = () => {
    const provider = getProvider();
    if (provider) {
      const publicKey = provider.publicKey;
      if (publicKey) {
        const walletKeys: PhantomWalletKeys = {
          bech32: publicKey.toString(),
          hex: publicKey.toBytes().toString('hex'),
        };
        setWalletKeysPhantom(walletKeys);
        setWalletKeysToLocalStorage('phantom', walletKeys);
        selectWallet('phantom');
      }
    }
  };

  const handleDisconnect = () => {
    setWalletKeysPhantom(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const disconnectPhantom = () => {
    if (!window.phantom?.ethereum) {
      return handlePhantomNotExists('disconnectPhantom');
    }

    // Clear the selected wallet
    selectWallet(null);
    setWalletKeysPhantom(null);
    cleanWalletsInLocalStorage();

    // Emit account changed event with an empty array to indicate disconnection
    window.phantom.ethereum.emit('disconnect');
  };

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
