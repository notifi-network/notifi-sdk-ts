import {
  useAccounts,
  useAutoConnectWallet,
  useConnectWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useSignPersonalMessage,
  useWallets,
} from '@mysten/dapp-kit';
import bs58 from 'bs58';
import { useCallback, useEffect, useState } from 'react';

import { AvailableChains } from '../context/NotifiWallets';
import { SuiWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const useSuiWallet = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  selectedChain: AvailableChains,
) => {
  const [walletKeySui, setWalletKeysSui] = useState<SuiWalletKeys | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<any>(null);

  const [isSuiInstalled, setIsSuiInstalled] = useState<boolean>(false);
  const accounts = useAccounts();
  const account = useCurrentAccount();
  const wallets = useWallets();

  const autoConnectionStatus = useAutoConnectWallet();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();

  useEffect(() => {
    if (wallets.length === undefined) return; // Wallets not loaded yet
    setIsSuiInstalled(true);
  }, [selectedChain, accounts]);

  const connectSui = useCallback(async (): Promise<SuiWalletKeys | null> => {
    try {
      const wallet = wallets.find((wallet) => wallet.name === 'Sui Wallet');
      if (!wallet) throw new Error('Sui Wallet not found');

      const walletKeysPromise = new Promise<SuiWalletKeys>(
        (resolve, reject) => {
          connect(
            { wallet },
            {
              onSuccess: (data) => {
                const account = data.accounts[0];
                const walletKeys: SuiWalletKeys = {
                  base58: bs58.encode(account.publicKey),
                  hex: account.address,
                  bech32: '',
                };
                setWalletKeysSui(walletKeys);
                setWalletKeysToLocalStorage('suiwallet', walletKeys);
                selectWallet('suiwallet');
                resolve(walletKeys);
              },
              onError: (error) => {
                reject(error);
              },
            },
          );
        },
      );

      return await walletKeysPromise;
    } catch (e) {
      errorHandler(
        new Error('Sui connection failed, check console for details'),
      );
      return null;
    }
  }, [errorHandler, selectWallet]);

  const disconnectSui = async () => {
    disconnect();
    selectWallet(null);
    setWalletKeysSui(null);
    cleanWalletsInLocalStorage();
  };

  const signArbitrarySui = useCallback(
    async (message: string): Promise<string> => {
      if (!walletKeySui) throw new Error('Wallet not found');
      const encoder = new TextEncoder();

      try {
        const signaturePromise = new Promise<string>((resolve, reject) => {
          signPersonalMessage(
            { message: encoder.encode(message) },
            {
              onSuccess: (result) => {
                resolve(result.signature);
              },
              onError: (error) => {
                reject(
                  new Error(
                    'Sui signArbitrary failed, check console for details',
                  ),
                );
              },
            },
          );
        });

        return await signaturePromise;
      } catch (error) {
        errorHandler(error);
      }
    },
    [walletKeySui],
  );

  return {
    isSuiInstalled,
    walletKeySui,
    connectSui,
    signArbitrarySui,
    disconnectSui,
    websiteURL: walletsWebsiteLink['suiwallet'],
  };
};
