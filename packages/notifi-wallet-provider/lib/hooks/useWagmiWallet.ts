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

import { EvmOptions } from '../context';
import { MetamaskWalletKeys, Wallets } from '../types';
import { defaultValue } from '../utils/constants';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

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
  // TODO: figure out config
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
    if (!isConnected || !address || !isWalletInstalled) return;
    if (selectedWallet !== walletName) return;

    const walletKeys = {
      bech32: converter(
        options?.cosmosChainPrefix ?? defaultValue.cosmosChainPrefix,
      ).toBech32(address),
      hex: address,
    };
    setWalletKeys(walletKeys);
    setWalletKeysToLocalStorage(walletName, walletKeys);
  }, [address, isWalletInstalled, isConnected, selectedWallet]);

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
    // if (isConnected) return null; /* ⬅ DISABLED - this is not only for certain wallet, this turns true when any wallet in connectors is connected. (KNOWN ISSUE) */
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
      if (!isConnected || !walletKeys || !address || !isWalletInstalled) {
        cleanWalletsInLocalStorage();
        errorHandler(
          new Error(
            `ERROR - useWagmiWallet.signArbitrary:: ${walletName} not initialized or not installed`,
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
    [walletKeys?.hex, address, isConnected, isWalletInstalled],
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
