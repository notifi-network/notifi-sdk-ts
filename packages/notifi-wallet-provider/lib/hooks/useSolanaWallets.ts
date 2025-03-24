import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PhantomWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const useSolanaWallets = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  walletName: keyof Wallets,
) => {
  const [walletKeys, setWalletKeys] = useState<PhantomWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(true);
  const isConnecting = useRef(false);
  const { connection } = useConnection();
  const {
    publicKey,
    signMessage,
    wallet,
    wallets,
    select,
    disconnect,
    connect,
    connected,
  } = useWallet();

  const tempWalletName = (
    walletName === 'phantomSolana'
      ? 'phantom'
      : walletName === 'solletExtension'
        ? 'sollet (extension)'
        : walletName
  ).toLowerCase();

  const isConnected =
    connection &&
    connected &&
    publicKey &&
    wallet?.adapter.name.toLowerCase()?.includes(tempWalletName);

  const handleWalletNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: ${walletName} not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    if (!isConnected || !publicKey) return;

    const walletKeys = {
      base58: publicKey.toBase58(),
    };
    setWalletKeys(walletKeys);
    selectWallet(walletName);
    setWalletKeysToLocalStorage(walletName, walletKeys);
  }, [isConnected, publicKey]);

  useEffect(() => {
    if (isConnecting.current && wallet) connectWallet();
  }, [isConnecting.current, wallet]);

  const connectWallet = async (
    timeoutInMiniSec?: number,
  ): Promise<PhantomWalletKeys | null> => {
    if (connected) return null;

    loadingHandler(true);
    const timer = setTimeout(() => {
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    try {
      if (isConnecting.current) {
        isConnecting.current = false;
        await connect();
        return null;
      } else {
        const wallet = wallets.find(({ adapter }) =>
          adapter.name.toLowerCase()?.includes(tempWalletName),
        );

        if (!wallet) {
          handleWalletNotExists('Connect Wallet');
          return null;
        }

        select(wallet.adapter.name);
        isConnecting.current = true;
        return null;
      }
    } catch (e: any) {
      disconnectWallet();
      console.error(e);
      errorHandler(
        new Error(
          'Wallet connection failed. Please try reconnecting your wallet.',
        ),
      );
      return null;
    } finally {
      loadingHandler(false);
      clearTimeout(timer);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    select(null);
    setWalletKeys(null);
    selectWallet(null);
    cleanWalletsInLocalStorage();
    loadingHandler(false);
  };

  const signArbitrary = useCallback(
    async (message: Uint8Array): Promise<Uint8Array | undefined> => {
      if (!isConnected || !signMessage) {
        handleWalletNotExists('Sign Arbitrary');
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      try {
        const signature = await signMessage(message);
        return signature;
      } catch (e) {
        errorHandler(
          new Error(
            'Failed to sign the message. Please approve the request in your wallet and try again.',
          ),
        );
        console.error(e);
      } finally {
        loadingHandler(false);
        clearTimeout(timer);
      }
    },
    [walletKeys?.base58, signMessage],
  );

  return {
    walletKeys,
    isWalletInstalled,
    connectWallet,
    signArbitrary,
    disconnectWallet,
    websiteURL: walletsWebsiteLink[walletName],
  };
};
