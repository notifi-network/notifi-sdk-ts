import converter from 'bech32-converting';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Config,
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSignMessage,
} from 'wagmi';
import { SendTransactionData, SendTransactionVariables } from 'wagmi/query';

import { EvmOptions } from '../context/NotifiWallets';
import { MetamaskWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  defaultValue,
  setWalletKeysToLocalStorage,
  walletsWebsiteLink,
} from '../utils';

/**
 * NOTE:
 * Unlink other useWallet hooks (ex, usePhantom, useKepler ..etc), `selectedWallet` is required here because wagmi does not support async connect methods.
 * As a result, the post-login logic is handled in a separate hook, which uses
 * `selectedWallet` to determine whether the wallet is currently active.
 */

export const useWagmiWallet = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
  selectedWallet: keyof Wallets | null,
  walletName: keyof Wallets,
  options?: EvmOptions,
) => {
  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);

  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { sendTransactionAsync } = useSendTransaction();
  const { address, isConnected } = useAccount();
  const {
    connect,
    connectors,
    error: connectError,
    isPending: isConnecting,
  } = useConnect();

  const isWalletInstalled = useMemo(() => {
    return !!connectors.find((v) => v.name.toLowerCase()?.includes(walletName));
  }, [connectors]);

  useEffect(() => {
    if (!isConnected || !address || !isWalletInstalled) {
      // Clear wallet keys when disconnected or wallet not available
      if (walletKeys && selectedWallet === walletName) {
        setWalletKeys(null);
      }
      return;
    }
    if (selectedWallet !== walletName) {
      // Clear wallet keys when switching to different wallet
      if (walletKeys) {
        setWalletKeys(null);
      }
      return;
    }

    const walletKeysData = {
      bech32: converter(
        options?.cosmosChainPrefix ?? defaultValue.cosmosChainPrefix,
      ).toBech32(address),
      hex: address,
    };
    setWalletKeys(walletKeysData);
    setWalletKeysToLocalStorage(walletName, walletKeysData);
  }, [
    address,
    isWalletInstalled,
    isConnected,
    selectedWallet,
    walletName,
    options?.cosmosChainPrefix,
  ]);

  useEffect(() => {
    switch (connectError?.name) {
      case 'UserRejectedRequestError': {
        const errorMsg = `useWagmiWallets - ${connectError.message}`;
        console.error(errorMsg);
        disconnectWallet();
        errorHandler(new Error(errorMsg), 5000);
        break;
      }
    }
  }, [connectError]);

  useEffect(() => {
    loadingHandler(isConnecting);
  }, [isConnecting]);

  const connectWallet = async (): Promise<MetamaskWalletKeys | null> => {
    const provider = connectors.find((v) =>
      v.name.toLowerCase()?.includes(walletName),
    );
    if (!provider) {
      const errorMsg = `useWagmiWallets - ${walletName} not initialized or not installed`;
      console.error(errorMsg);
      errorHandler(new Error(errorMsg), 5000);
      return null;
    }
    selectWallet(walletName);
    connect({ connector: provider });
    return null;
  };

  const disconnectWallet = () => {
    setWalletKeys(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
    disconnect();
    loadingHandler(false);
  };

  const signArbitrary = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      // Check if this wallet is selected and basic requirements are met
      if (selectedWallet !== walletName) {
        errorHandler(
          new Error(
            `ERROR - useWagmiWallet.signArbitrary:: ${walletName} is not the selected wallet`,
          ),
        );
        return;
      }

      if (!isConnected || !address || !isWalletInstalled) {
        cleanWalletsInLocalStorage();
        errorHandler(
          new Error(
            `ERROR - useWagmiWallet.signArbitrary:: ${walletName} not connected or not installed`,
          ),
        );
        return;
      }

      // If walletKeys is not set but we have address and are connected,
      // create the wallet keys directly instead of waiting
      let currentWalletKeys = walletKeys;
      if (!currentWalletKeys && address && isConnected) {
        currentWalletKeys = {
          bech32: converter(
            options?.cosmosChainPrefix ?? defaultValue.cosmosChainPrefix,
          ).toBech32(address),
          hex: address,
        };
        // Update the state for future use
        setWalletKeys(currentWalletKeys);
        setWalletKeysToLocalStorage(walletName, currentWalletKeys);
      }

      if (!currentWalletKeys) {
        cleanWalletsInLocalStorage();
        errorHandler(
          new Error(
            `ERROR - useWagmiWallet.signArbitrary:: ${walletName} wallet keys not initialized`,
          ),
        );
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      try {
        const signature: `0x${string}` = await signMessageAsync({
          account: address,
          message: message,
        });

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
    [
      walletKeys?.hex,
      address,
      isConnected,
      isWalletInstalled,
      selectedWallet,
      walletName,
      options?.cosmosChainPrefix,
    ],
  );

  const sendTransaction = async (
    transaction: SendTransactionVariables<Config, number>,
  ) => {
    let result: SendTransactionData = '0x0';
    try {
      result = await sendTransactionAsync(transaction);
    } catch (e) {
      errorHandler(
        new Error('useWagmi-sendTransaction: Failed to send transaction'),
        5000,
      );
      console.error(e);
    } finally {
      loadingHandler(false);
    }
    return result;
  };

  return {
    walletKeys,
    isWalletInstalled,
    connectWallet,
    signArbitrary,
    disconnectWallet,
    websiteURL: walletsWebsiteLink[walletName],
    sendTransaction,
  };
};

export type WagmiWalletHookType = ReturnType<typeof useWagmiWallet>;
