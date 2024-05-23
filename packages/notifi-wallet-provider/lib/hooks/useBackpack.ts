import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const currentPublicKey = useRef<string | null>(null);
  const isConnecting = useRef(false); // Prevent multiple connections

  useEffect(() => {
    const newWallet = new BackpackWalletAdapter();
    setWallet(newWallet);
    if (!newWallet) throw new Error('Wallet not found');
    setIsBackpackInstalled(true);
  }, [selectedChain]);

  const handleBackpackNotExists = useCallback(
    (location: string) => {
      cleanWalletsInLocalStorage();
      errorHandler(
        new Error(
          `ERROR - ${location}: window.backpack not initialized or not installed`,
        ),
      );
    },
    [errorHandler],
  );

  const disconnectBackpack = useCallback(async () => {
    try {
      await wallet.disconnect();
      selectWallet(null);
      setWalletKeysBackpack(null);
      cleanWalletsInLocalStorage();
      currentPublicKey.current = null;
    } catch (e) {
      console.error('Error while disconnecting: ', e);
    }
  }, [wallet, selectWallet]);

  const handleDisconnect = useCallback(async () => {
    if (wallet) {
      wallet.off('disconnect', handleDisconnect);
    }
    await disconnectBackpack();
  }, [wallet, disconnectBackpack]);

  const checkAccountChange = async () => {
    if (
      !wallet ||
      !window.backpack ||
      !window.backpack?.publicKey ||
      !currentPublicKey
    )
      return;
    console.log('Checking account change');
    console.log(currentPublicKey.current);

    let publicKey: string | null = null;

    if (window.backpack && window.backpack.publicKey) {
      publicKey = window?.backpack.publicKey?.toBase58();
      console.log('pubkey window: ' + publicKey);
      console.log(
        `Public keys are equal: ${publicKey === currentPublicKey.current}`,
      );
    }

    if (publicKey && publicKey !== currentPublicKey.current) {
      await disconnectBackpack();
      window.dispatchEvent(
        new CustomEvent('backpackAccountChanged', { detail: publicKey }),
      );
    }
  };

  useEffect(() => {
    if (wallet) {
      const interval = setInterval(checkAccountChange, 1000); // Check every second
      return () => clearInterval(interval);
    }
  }, [wallet, checkAccountChange]);

  const connectBackpack =
    useCallback(async (): Promise<BackpackWalletKeys | null> => {
      if (isConnecting.current) {
        return null; // Prevent multiple connections
      }

      if (!isBackpackInstalled) {
        return null;
      }

      loadingHandler(true);
      isConnecting.current = true;

      try {
        if (!wallet) throw new Error('Wallet not found');

        const onConnect = (publicKey: PublicKey) => {
          console.log('On connect fired');
          console.log(publicKey);
        };

        wallet.on('connect', onConnect);
        console.log('test');

        await wallet.connect();

        const publicKey = wallet.publicKey;
        if (!publicKey) throw new Error('Wallet connection failed');

        currentPublicKey.current = publicKey.toBase58();

        const walletKeys: BackpackWalletKeys = {
          base58: publicKey.toBase58(),
          hex: Buffer.from(bs58.decode(publicKey.toBase58())).toString('hex'),
          bech32: '',
        };

        wallet.on('disconnect', handleDisconnect);

        selectWallet('backpack');
        setWalletKeysBackpack(walletKeys);
        setWalletKeysToLocalStorage('backpack', walletKeys);

        return walletKeys;
      } catch (e) {
        errorHandler(
          new Error('Backpack connection failed, check console for details'),
        );
        console.error(e);
      } finally {
        isConnecting.current = false;
        loadingHandler(false);
      }

      return null;
    }, [
      isBackpackInstalled,
      loadingHandler,
      wallet,
      handleDisconnect,
      selectWallet,
      errorHandler,
    ]);

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
    [
      walletKeysBackpack,
      wallet,
      errorHandler,
      loadingHandler,
      handleBackpackNotExists,
    ],
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
