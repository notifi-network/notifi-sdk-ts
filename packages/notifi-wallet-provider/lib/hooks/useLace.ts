import { useCallback, useEffect, useState } from 'react';

import { LaceWalletKeys, Wallets } from '../types';
import {
  Cbor,
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
  walletsWebsiteLink,
} from '../utils';

export type LaceWalletHookType = {
  isLaceInstalled: boolean;
  walletKeysLace: LaceWalletKeys | null;
  connectLace: () => Promise<LaceWalletKeys | null>;
  signArbitraryLace: (message: string) => Promise<string | undefined>;
  disconnectLace: () => void;
  websiteURL: string;
};

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
    loadingHandler(true);

    const checkLaceWallet = () => {
      console.log('🔍 Debugging Lace wallet detection...');
      console.log('window.cardano:', window.cardano);
      console.log('window.cardano?.lace:', window.cardano?.lace);

      if (window.cardano?.lace) {
        console.log(
          '✅ Found Lace wallet (Cardano + Midnight support):',
          window.cardano.lace,
        );
        setIsLaceInstalled(true);
        return true;
      }

      if (window.midnight?.mnLace) {
        console.log(
          '✅ Found Lace via Midnight interface:',
          window.midnight.mnLace,
        );
        setIsLaceInstalled(true);
        return true;
      }

      console.log('❌ No Lace wallet interface found');
      setIsLaceInstalled(false);
      return false;
    };

    const detected = checkLaceWallet();
    console.log('🎯 Final detection result:', detected);

    loadingHandler(false);

    return () => {};
  }, []);

  const connectLace = useCallback(async (): Promise<LaceWalletKeys | null> => {
    const laceWallet = window.cardano?.lace || window.midnight?.mnLace;

    if (!laceWallet) {
      handleLaceNotExists('connectLace');
      return null;
    }

    loadingHandler(true);
    try {
      console.log('🔗 Attempting to connect to Lace wallet...');

      const walletApi = await laceWallet.enable();
      console.log('✅ Wallet enabled successfully:', walletApi);

      let accounts: Cbor[] = [];

      try {
        if (walletApi.getUsedAddresses) {
          accounts = await walletApi.getUsedAddresses();
          console.log('📋 getUsedAddresses() result:', accounts);
        }
      } catch (e) {
        console.log('⚠️ getUsedAddresses() failed:', e);
      }

      if (!accounts || accounts.length === 0) {
        try {
          if (walletApi.getUnusedAddresses) {
            accounts = await walletApi.getUnusedAddresses();
            console.log('📋 getUnusedAddresses() result:', accounts);
          }
        } catch (e) {
          console.log('⚠️ getUnusedAddresses() failed:', e);
        }
      }

      if (!accounts || accounts.length === 0) {
        try {
          if (walletApi.getChangeAddress) {
            const changeAddress = await walletApi.getChangeAddress();
            if (changeAddress) {
              accounts = [changeAddress];
              console.log('📋 getChangeAddress() result:', changeAddress);
            }
          }
        } catch (e) {
          console.log('⚠️ getChangeAddress() failed:', e);
        }
      }

      if (!accounts || accounts.length === 0) {
        throw new Error(
          'No addresses found in wallet. Please ensure your wallet has at least one address.',
        );
      }

      const cborAddress = accounts[0];

      let bech32Address = cborAddress;
      try {
        const { bech32 } = await import('bech32');
        const buffer = Buffer.from(cborAddress, 'hex');
        const words = bech32.toWords(buffer);
        bech32Address = bech32.encode('addr', words, 1000);
        console.log('✅ Decoded bech32 address:', bech32Address);
      } catch (e) {
        console.warn('⚠️ Failed to decode CBOR to bech32, using raw CBOR:', e);
      }

      const walletKeys: LaceWalletKeys = {
        bech32: bech32Address,
        cbor: cborAddress,
      };

      console.log('🔑 Wallet keys generated:', walletKeys);

      setWalletKeysLace(walletKeys);
      setWalletKeysToLocalStorage('lace', walletKeys);
      selectWallet('lace');

      console.log('🎉 Lace wallet connected successfully!');
      return walletKeys;
    } catch (error) {
      console.error('❌ Error connecting to Lace wallet:', error);
      errorHandler(new Error(`Failed to connect to Lace wallet: ${error}`));
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
    async (message: string): Promise<string | undefined> => {
      console.log('🔥 signArbitraryLace called with message:', message);

      const laceWallet = window.cardano?.lace || window.midnight?.mnLace;

      if (!laceWallet || !walletKeysLace) {
        console.error('❌ Lace wallet or keys not available');
        console.log('laceWallet:', laceWallet);
        console.log('walletKeysLace:', walletKeysLace);
        handleLaceNotExists('signArbitraryLace');
        return undefined;
      }

      loadingHandler(true);
      try {
        console.log('🔗 Getting wallet API...');
        const walletApi = await laceWallet.enable();
        console.log('✅ Wallet API obtained:', walletApi);

        const messageHex = Buffer.from(message, 'utf8').toString('hex');
        console.log('📝 Message in hex:', messageHex);
        console.log('🔑 Using address (bech32):', walletKeysLace.bech32);
        console.log('🔑 Using address (CBOR):', walletKeysLace.cbor);

        const result = await walletApi.signData(
          walletKeysLace.cbor,
          messageHex,
        );

        console.log('✅ Raw signature result:', result);

        // signData returns { signature: HexString; key: HexString; }
        const signature = result.signature;

        console.log('🎯 Final signature:', signature);
        return signature;
      } catch (error) {
        console.error('❌ Lace signing error:', error);
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
