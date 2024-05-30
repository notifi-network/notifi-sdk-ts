import Solflare from '@solflare-wallet/sdk';
import bs58 from 'bs58';
import { useCallback, useEffect, useState } from 'react';

import { AvailableChains, EVMChains } from '../context/NotifiWallets';
import { SolflareWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const useSolflare = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  selectedChain: AvailableChains,
) => {
  const [wallet, setWallet] = useState<any>();
  const [walletKeysSolflare, setWalletKeysSolflare] =
    useState<SolflareWalletKeys | null>(null);
  const [isSolflareInstalled, setIsSolflareInstalled] =
    useState<boolean>(false);

  const handleSolflareNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.solflare not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    setWallet(new Solflare());
    setIsSolflareInstalled(true);
    if (wallet === undefined) {
      // The wallet is not loaded yet. You could show a loading spinner here.
      return;
    }
    if (!wallet) throw new Error('Wallet not found');
  }, [selectedChain]);

  const connectSolflare =
    useCallback(async (): Promise<SolflareWalletKeys | null> => {
      if (!window.solflare) {
        return null;
      }
      loadingHandler(true);

      try {
        if (!wallet) throw new Error('Wallet not found');

        wallet.on('disconnect', disconnectSolflare);
        wallet.on('accountChanged', disconnectSolflare);

        await wallet.connect();

        const walletKeys: SolflareWalletKeys = {
          base58: wallet.publicKey.toBase58() ?? '',
          hex: Buffer.from(
            bs58.decode(wallet?.publicKey?.toBase58() ?? ''),
          ).toString('hex'),
          bech32: '',
        };

        if (!walletKeys) throw new Error('Wallet Keys not found');

        selectWallet('solflare');
        setWalletKeysSolflare(walletKeys);
        setWalletKeysToLocalStorage('solflare', walletKeys);
        loadingHandler(false);
        return walletKeysSolflare;
      } catch (e) {
        errorHandler(
          new Error('Solflare connection failed, check console for details'),
        );
      }

      loadingHandler(false);
      return null;
    }, [selectWallet, errorHandler]);

  const disconnectSolflare = async () => {
    try {
      await wallet.disconnect();
      selectWallet(null);
      setWalletKeysSolflare(null);
      cleanWalletsInLocalStorage();
    } catch (e) {
      console.error('Error whilst establishing connection: ', e);
    }
  };

  const signArbitrarySolflare = useCallback(
    async (message: string): Promise<string | void> => {
      if (!wallet) throw new Error('Wallet not found');
      if (!window.solflare) {
        return handleSolflareNotExists('signArbitrarySolflare');
      }

      const encoder = new TextEncoder();

      loadingHandler(true);
      try {
        const messageBytes = encoder.encode(message);
        const messageSignature = await wallet.signMessage(messageBytes, 'utf8');
        return messageSignature;
      } catch (error) {
        errorHandler(
          new Error('Solflare signArbitrary failed, check console for details'),
        );
      }
      loadingHandler(false);
    },
    [walletKeysSolflare],
  );

  return {
    isSolflareInstalled,
    walletKeysSolflare,
    connectSolflare,
    signArbitrarySolflare,
    disconnectSolflare,
    websiteURL: walletsWebsiteLink['solflare'],
  };
};
