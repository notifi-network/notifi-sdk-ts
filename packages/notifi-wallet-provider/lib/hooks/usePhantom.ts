import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
import { Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';
import converter from 'bech32-converting';
import bs58 from 'bs58';
import { Buffer } from 'buffer';
// import { AvailableChains } from 'notifi-wallet-provider';
import { useCallback, useEffect, useState } from 'react';

import { EVMChains } from '../context/NotifiWallets';
import { PhantomWallet, PhantomWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const usePhantom = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  selectedChain: 'solana' | EVMChains,
) => {
  const getProvider = () => {
    console.log('Getting provider');
    if ('phantom' in window) {
      const provider: any = window.phantom?.solana;
      console.log(`Provider is ${provider}`);

      if (provider?.isPhantom) {
        console.log('Phantom defo installed');
        return provider;
      } else {
        console.log('Phantom not installed');
      }
    }
  };

  const [walletKeysPhantom, setWalletKeysPhantom] =
    useState<PhantomWalletKeys | null>(null);

  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (selectedChain === 'solana') {
      console.log('window.phantom? ' + window.phantom);
      console.log(window.phantom);
      console.log('solana instlled?? ' + !!window.solana);
      setIsPhantomInstalled(!!window.solana);
    } else {
      setIsPhantomInstalled(!!injectivePhantomWallet.strategies?.phantom);
    }
  }, [selectedChain]);

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

      loadingHandler(true);

      try {
        if (selectedChain === 'solana') {
          const provider = getProvider();
          if (!provider) {
            throw new Error('Phantom provider not found');
          }

          const { publicKey } = await provider.connect();

          console.log('public key');
          console.log(publicKey.toBase58().toString());

          const walletKeys: PhantomWalletKeys = {
            base58: publicKey.toBase58(),
            hex: Buffer.from(bs58.decode(publicKey.toBase58())).toString('hex'),
            bech32: '',
          };

          selectWallet('phantom');
          setWalletKeysPhantom(walletKeys);
          setWalletKeysToLocalStorage('phantom', walletKeys);
          loadingHandler(false);
          return walletKeys;
        } else {
          // check if injectivePhantomWallet is installed
          const accounts = await injectivePhantomWallet.getAddresses();

          const walletKeys = {
            bech32: converter('inj').toBech32(accounts[0]),
            hex: accounts[0],
            base58: '',
          };
          selectWallet('phantom');
          setWalletKeysPhantom(walletKeys);
          setWalletKeysToLocalStorage('phantom', walletKeys);
          loadingHandler(false);
          return walletKeys;
        }
      } catch (e) {
        errorHandler(
          new Error('Phantom connection failed, check console for details'),
        );
      }

      loadingHandler(false);
      return null;
    }, [selectWallet, errorHandler, selectedChain]);

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
      if (!walletKeysPhantom) {
        return;
      }
      loadingHandler(true);
      try {
        if (selectedChain === 'solana') {
          const provider = getProvider();
          if (!provider) {
            throw new Error('Phantom provider not found');
          }
          const messageBuffer = Buffer.from(message, 'utf-8');
          const signedMessage = await provider.request({
            method: 'signMessage',
            params: {
              message: messageBuffer,
              display: 'hex',
            },
          });

          console.log('signedMessage');
          console.log(signedMessage);
          console.log('signedMessage.signature');
          console.log(signedMessage.signature);

          // Return the signed message as is
          return signedMessage.signature;
        } else {
          const accounts = await injectivePhantomWallet.getAddresses();
          const result = await injectivePhantomWallet.signArbitrary(
            accounts[0],
            message,
          );
          return result;
        }
      } catch (e) {
        errorHandler(
          new Error('Phantom signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysPhantom, selectedChain],
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
