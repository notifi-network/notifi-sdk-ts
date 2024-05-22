import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { PublicKey } from '@solana/web3.js';
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
  const [wallet, setWallet] = useState<BackpackWalletAdapter | null>(null);
  const [walletKeysBackpack, setWalletKeysBackpack] =
    useState<BackpackWalletKeys | null>(null);
  const [isBackpackInstalled, setIsBackpackInstalled] =
    useState<boolean>(false);

  useEffect(() => {
    const newWallet = new BackpackWalletAdapter();
    setWallet(newWallet);
    if (!newWallet) throw new Error('Wallet not found');
    setIsBackpackInstalled(true);
  }, [selectedChain]);

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
      if (!isBackpackInstalled) {
        return null;
      }

      loadingHandler(true);

      try {
        if (!wallet) throw new Error('Wallet not found');

        await wallet.connect();

        const publicKey = wallet.publicKey;
        if (!publicKey) throw new Error('Wallet connection failed');

        const walletKeys: BackpackWalletKeys = {
          base58: publicKey.toBase58(),
          hex: Buffer.from(bs58.decode(publicKey.toBase58())).toString('hex'),
          bech32: '',
        };

        selectWallet('backpack');
        setWalletKeysBackpack(walletKeys);
        setWalletKeysToLocalStorage('backpack', walletKeys);

        return walletKeys;
      } catch (e) {
        errorHandler(
          new Error('Backpack connection failed, check console for details'),
        );
      } finally {
        loadingHandler(false);
      }

      return null;
    }, [
      wallet,
      isBackpackInstalled,
      selectWallet,
      errorHandler,
      loadingHandler,
    ]);

  const disconnectBackpack = async () => {
    try {
      await wallet?.disconnect();
      selectWallet(null);
      setWalletKeysBackpack(null);
      cleanWalletsInLocalStorage();
    } catch (e) {
      console.error('Error while disconnecting: ', e);
    }
  };

  const signArbitraryBackpack = useCallback(
    async (message: string): Promise<string | void> => {
      if (!window.backpack) {
        return handleBackpackNotExists('signArbitraryBackpack');
      }
      if (!walletKeysBackpack || !wallet) {
        return;
      }
      loadingHandler(true);
      try {
        const messageBuffer = Buffer.from(message, 'utf-8');
        console.log('Signing message');
        const signedMessage = await wallet.signMessage(messageBuffer);
        console.log('Signed message: ');
        console.log(signedMessage);

        // Extracting the signature from the signedMessage object
        const signatureArray =
          signedMessage instanceof Uint8Array
            ? signedMessage
            : new Uint8Array(Object.values(signedMessage.signature));

        // Convert the signature to a base64 string
        const signature = Buffer.from(signatureArray).toString('base64');
        console.log('Signature (base64 encoded): ', signature);

        return signature;
      } catch (e) {
        errorHandler(
          new Error('Backpack signArbitrary failed, check console for details'),
        );
        console.error(e);
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysBackpack, wallet, errorHandler, loadingHandler],
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
