import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from '@burnt-labs/abstraxion';
import { useCallback, useEffect, useState } from 'react';

import { Wallets, XionWalletKeys } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const useXion = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  walletName: keyof Wallets,
) => {
  const [walletKeys, setWalletKeys] = useState<XionWalletKeys | null>(null);
  const { data: account } = useAbstraxionAccount();
  const { client, signArb, logout } = useAbstraxionSigningClient();
  const [, setShowModal]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useModal();

  const handleWalletNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: ${walletName} not initialized or not installed`,
      ),
    );
  };

  const fetchAccountData = async () => {
    if (!client?.granteeAddress || !account?.bech32Address)
      return setWalletKeys(null);

    const accountData = await client.getGranteeAccountData();
    const pubKey = accountData
      ? Buffer.from(accountData.pubkey).toString('base64')
      : '';

    const walletKeys = {
      grantee: client?.granteeAddress,
      granter: account.bech32Address,
      pubKey,
    };
    setWalletKeys(walletKeys);
    selectWallet(walletName);
    setWalletKeysToLocalStorage(walletName, walletKeys);
    setShowModal(false);
    loadingHandler(false);
  };

  useEffect(() => {
    fetchAccountData();
  }, [client?.granteeAddress, account?.bech32Address]);

  const connectWallet = async () => {
    loadingHandler(true);
    setShowModal(true);
    return null;
  };

  const disconnectWallet = () => {
    setWalletKeys(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
    logout?.();
    setShowModal(false);
  };

  const signArbitrary = useCallback(
    async (message: string): Promise<string | undefined> => {
      if (!signArb || !walletKeys) {
        handleWalletNotExists('Sign Arbitrary');
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      try {
        const signature = await signArb(walletKeys.grantee, message);

        return signature;
      } catch (e) {
        errorHandler(
          new Error('Wallet not signed. Please connect your wallet again.'),
        );
        console.error(e);
      } finally {
        loadingHandler(false);
        clearTimeout(timer);
      }
    },
    [signArb, walletKeys],
  );

  return {
    walletKeys,
    isWalletInstalled: true,
    connectWallet,
    signArbitrary,
    disconnectWallet,
    websiteURL: walletsWebsiteLink[walletName],
  };
};
