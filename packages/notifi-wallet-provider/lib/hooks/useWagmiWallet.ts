import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from 'wagmi';

import { AvailableChains } from '../context/NotifiWallets';
import { MetamaskWalletKeys, Wallets } from '../types';
import { getChainInfoByName } from '../utils/chainInfo';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const useWagmiWallet = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  walletName: keyof Wallets,
  selectedChain: AvailableChains,
) => {
  const { chains, switchChainAsync } = useSwitchChain();

  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected: isWalletConnected, connector } = useAccount();
  const { connectors, connectAsync } = useConnect();

  const isConnected =
    isWalletConnected && connector?.name.toLowerCase().includes(walletName);

  useEffect(() => {
    const switchChain = async () => {
      try {
        if (selectedChain === 'polygon') {
          await switchChainAsync({ chainId: 137 });
        } else if (selectedChain === 'arbitrum') {
          await switchChainAsync({ chainId: 42161 });
        } else if (selectedChain === 'ethereum') {
          await switchChainAsync({ chainId: 1 });
        }
      } catch (error) {
        console.error('Error switching chain:', error);
      }
    };

    switchChain();
  }, [chains, selectedChain, switchChainAsync]);

  const handleWalletNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: ${walletName} not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    const provider = connectors.find((v) =>
      v.name.toLowerCase()?.includes(walletName),
    );
    setIsWalletInstalled(!!provider);
  }, [connectors]);

  useEffect(() => {
    if (!isConnected || !address || !isWalletInstalled) return;

    const walletKeys = {
      bech32: converter(selectedChain).toBech32(address),
      hex: address,
    };
    setWalletKeys(walletKeys);
    selectWallet(walletName);
    setWalletKeysToLocalStorage(walletName, walletKeys);
  }, [address, isWalletInstalled, isConnected]);

  const connectWallet = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    if (isWalletConnected) return null;

    loadingHandler(true);

    const timer = setTimeout(() => {
      disconnectWallet();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    try {
      const provider = connectors.find((v) =>
        v.name.toLowerCase()?.includes(walletName),
      );
      if (!provider) return null;

      await connectAsync({
        connector: provider,
        chainId: parseInt(getChainInfoByName(selectedChain).chainId, 16),
      });
      return null;
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
    disconnect();
  };

  const signArbitrary = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      if (!isConnected || !walletKeys || !address) {
        handleWalletNotExists('Sign Arbitrary');
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      await switchChainAsync({
        chainId: parseInt(getChainInfoByName(selectedChain).chainId, 16),
      });

      try {
        const signature: `0x${string}` = await signMessageAsync({
          message: message,
        });

        return signature;
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
