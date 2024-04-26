import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { Ethereum, MetamaskWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';

export const useWallet = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  walletName: keyof Wallets,
  provider: Ethereum,
) => {
  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  const handleWalletNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: ${walletName} not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    setIsWalletInstalled(!!provider);

    if (!provider) return;

    const handleAccountChange = () => {
      errorHandler(new Error(`${walletName} account changed`));

      provider
        .request?.({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const walletKeys = {
            bech32: converter('inj').toBech32(accounts[0]), // TODO: dynamic cosmos chain addr conversion
            hex: accounts[0],
          };
          setWalletKeys(walletKeys);
        });
    };

    provider.on?.('accountsChanged', handleAccountChange);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountChange);
    };
  }, [provider]);

  const connectWallet = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    if (!provider) {
      handleWalletNotExists('connectWallet');
      return null;
    }

    let timer: undefined | NodeJS.Timeout = undefined;
    try {
      loadingHandler(true);

      timer = setTimeout(() => {
        disconnectWallet();
        loadingHandler(false);
      }, timeoutInMiniSec ?? 5000);

      const accounts = await provider.request?.({
        method: 'eth_requestAccounts',
      });

      const walletKeys = {
        bech32: converter('inj').toBech32(accounts[0]),
        hex: accounts[0],
      };

      selectWallet(walletName);
      setWalletKeys(walletKeys);
      setWalletKeysToLocalStorage(walletName, walletKeys);
      return walletKeys;
    } catch (e: any) {
      console.error(e);
      disconnectWallet();
      e.message && errorHandler(new Error(e.message));
      return null;
    } finally {
      loadingHandler(false);
      clearTimeout(timer);
    }
  };

  const disconnectWallet = () => {
    setWalletKeys(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitrary = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      if (!provider || !walletKeys) {
        handleWalletNotExists('signArbitrary');
        return;
      }

      try {
        loadingHandler(true);

        const signature: Promise<`0x${string}`> = await provider.request?.({
          method: 'personal_sign',
          params: [
            Buffer.from(message).toString('hex'),
            /** ⬆️
             * hex-encoded UTF-8 string to present to the user. See how to encode a string like this in the browser-string-hexer module.
             * @ref https://docs.metamask.io/wallet/reference/personal_sign/
             */
            walletKeys?.hex,
          ],
        });

        return signature;
        // ⬆️ Note:A hex-encoded 129-byte array starting with 0x.
      } catch (e) {
        errorHandler(
          new Error(
            `${walletName}'s signArbitrary failed, check console for details`,
          ),
        );
        console.error(e);
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeys?.hex],
  );

  return {
    walletKeys,
    isWalletInstalled,
    connectWallet,
    signArbitrary,
    disconnectWallet,
  };
};
