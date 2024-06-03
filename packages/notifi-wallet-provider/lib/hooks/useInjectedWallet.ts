import converter from 'bech32-converting';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AvailableChains } from '../context/NotifiWallets';
import { Ethereum, MetamaskWalletKeys, Wallets } from '../types';
import { getChainInfoByName } from '../utils/chainInfo';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';
import { useSyncInjectedProviders } from './useSyncInjectedProviders';

export const useInjectedWallet = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  walletName: keyof Wallets,
  selectedChain: AvailableChains,
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

  const injectedProviders = useSyncInjectedProviders();

  const provider = useMemo(
    () =>
      injectedProviders.find(
        (v) =>
          v.info?.rdns?.toLowerCase().includes(walletName.toLowerCase()) ||
          v.info?.name?.toLowerCase().includes(walletName.toLowerCase()),
      )?.provider as unknown as Ethereum,
    [injectedProviders],
  );

  const getChainIdByName = (chain: AvailableChains) => {
    switch (chain) {
      case 'injective':
      case 'ethereum':
        return '0x1';
      case 'polygon':
        return '0x89';
      case 'arbitrum':
        return '0xa4b1';
      // case 'injective':
      //   return '0x9dd';
      default:
        throw new Error(`Unsupported Chain: ${chain}`);
    }
  };

  useEffect(() => {
    setIsWalletInstalled(!!provider);

    if (!provider) return;

    const handleAccountChange = () => {
      provider
        .request?.({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const walletKeys = {
            bech32: converter(
              selectedChain == 'injective' ? 'inj' : 'eth',
            ).toBech32(accounts[0]), // TODO: dynamic cosmos chain addr conversion
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
      handleWalletNotExists('Connect Wallet');
      return null;
    }

    loadingHandler(true);
    const timer = setTimeout(() => {
      disconnectWallet();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    try {
      const chainId = await provider.request?.({ method: 'eth_chainId' });

      // Check if the current chain ID matches the selected chain
      if (chainId !== getChainIdByName(selectedChain)) {
        try {
          await provider.request?.({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: getChainIdByName(selectedChain) }],
          });
        } catch (switchError: any) {
          // 4902 = Chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await provider.request?.({
                method: 'wallet_addEthereumChain',
                params: [getChainInfoByName(selectedChain)],
              });
            } catch (addError) {
              console.error('Error adding chain:', addError);
              throw addError;
            }
          } else {
            console.error('Failed to switch chain:', switchError);
            throw switchError;
          }
        }
        // If the chain IDs don't match, prompt the user to switch to the correct chain
      }

      const accounts = await provider.request?.({
        method: 'eth_requestAccounts',
      });

      const walletKeys = {
        bech32: converter(
          selectedChain === 'injective' ? 'inj' : 'eth',
        ).toBech32(accounts[0]),
        hex: accounts[0],
      };

      selectWallet(walletName);
      setWalletKeys(walletKeys);
      setWalletKeysToLocalStorage(walletName, walletKeys);
      return walletKeys;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        handleWalletNotExists('Sign Arbitrary');
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      try {
        const signature: Promise<`0x${string}`> = await provider.request?.({
          method: 'personal_sign',
          params: [message, walletKeys?.hex],
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
        clearTimeout(timer);
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
    websiteURL: walletsWebsiteLink[walletName],
  };
};
