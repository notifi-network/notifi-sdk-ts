import { Connection, Transaction } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';

import { PhantomWalletKeys, Wallets } from '../types';
import {
  PhantomProvider,
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
  walletsWebsiteLink,
} from '../utils';

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
    getPhantomFromWindow()
      .then((phantom) => {
        setIsPhantomInstalled(true);
        phantom.on('accountChanged', handleAccountChange);
      })
      .catch(() => {
        setIsPhantomInstalled(false);
      })
      .finally(() => loadingHandler(false));

    const handleAccountChange = () => {
      if (!window.phantom) return handlePhantomNotExists('handleAccountChange');
      const walletKeys: PhantomWalletKeys = {
        base58: window.phantom.solana.publicKey?.toBase58() ?? '',
      };

      setWalletKeysPhantom(walletKeys);
    };
  }, []);

  const connectPhantom = async (): Promise<PhantomWalletKeys | null> => {
    if (!window.phantom.solana) {
      handlePhantomNotExists('connectPhantom');
      return null;
    }
    loadingHandler(true);
    try {
      await window.phantom.solana.connect();

      const key = await window.phantom.solana.publicKey?.toBase58();
      if (!key) throw new Error('Phantom connection failed');
      const walletKeys: PhantomWalletKeys = {
        base58: key,
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
  };

  const signTransactionPhantom = async (
    transaction: Transaction,
    connection: Connection,
  ) => {
    const signedTransaction =
      await window.phantom.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
    );
    return signature;
  };

  const signHardwareTransactionPhantom = async (transaction: Transaction) => {
    const signedTransaction =
      await window.phantom.solana.signTransaction(transaction);
    return signedTransaction;
  };

  const disconnectPhantom = () => {
    if (!window.phantom.solana)
      return handlePhantomNotExists('disconnectPhantom');
    window.phantom.solana.disconnect();
    setWalletKeysPhantom(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitraryPhantom = useCallback(
    async (message: string | Uint8Array): Promise<Uint8Array> => {
      if (!window.phantom.solana || !walletKeysPhantom) {
        handlePhantomNotExists('signArbitraryPhantom');
        return new Uint8Array();
      }
      loadingHandler(true);
      try {
        const result = await window.phantom.solana.signMessage(message);
        return result.signature;
      } catch (e) {
        errorHandler(
          new Error('Wallet not signed. Please connect your wallet again.'),
        );
        console.error(e);
        return new Uint8Array();
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysPhantom],
  );
  return {
    isPhantomInstalled,
    walletKeysPhantom,
    connectPhantom,
    signTransactionPhantom,
    signArbitraryPhantom,
    disconnectPhantom,
    signHardwareTransactionPhantom,
    websiteURL: walletsWebsiteLink['phantom'],
  };
};

const getPhantomFromWindow = async (): Promise<PhantomProvider> => {
  if (typeof window === 'undefined' || !window.phantom.solana) {
    throw new Error(
      'Cannot get phantom without a window | Cannot get phantom solana from window',
    );
  }
  if (window.phantom.solana) {
    return window.phantom.solana;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Phantom extension (Solana)');
  }
  return new Promise<PhantomProvider>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.phantom.solana) {
          resolve(window.phantom.solana);
        } else {
          reject('Please install the Phantom extension (Solana)');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
