import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';
import {
  Config,
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSignMessage,
} from 'wagmi';
import { SendTransactionData, SendTransactionVariables } from 'wagmi/query';

import { MetamaskWalletKeys, Wallets } from '../types';
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
) => {
  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  // TODO: figure out config
  const { sendTransactionAsync } = useSendTransaction();
  const { address, isConnected: isWalletConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();

  const isConnected =
    isWalletConnected && connector?.name.toLowerCase().includes(walletName);

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
    if (walletName === 'coinbase') {
      console.log({ provider, walletName, connectors });
    }
    setIsWalletInstalled(!!provider);
  }, [connectors]);

  useEffect(() => {
    if (!isConnected || !address || !isWalletInstalled) return;

    const walletKeys = {
      bech32: converter('inj').toBech32(address),
      hex: address,
    };
    setWalletKeys(walletKeys);
    selectWallet(walletName);
    setWalletKeysToLocalStorage(walletName, walletKeys);
  }, [address, isWalletInstalled, isConnected]);

  const connectWallet = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    console.log({ isWalletConnected });
    /* ⬇  Disable for now because of the viem issue (isWalletConnected turns true even if the wallet is not connected) */
    // if (isWalletConnected) return null;

    loadingHandler(true);
    const timer = setTimeout(() => {
      disconnectWallet();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    try {
      const provider = connectors.find((v) =>
        v.name.toLowerCase()?.includes(walletName),
      );
      console.log({ provider, connectors });
      if (!provider) return null;
      console.log(`found provider and starting connection`);
      connect({ connector: provider });
      return null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(`failed to connect to ${walletName} wallet`, e);
      console.error(e);
      disconnectWallet();
      if (e.message) {
        errorHandler(new Error(e.message));
      }
      return null;
    } finally {
      loadingHandler(false);
      clearTimeout(timer);
    }
    console.log(`connected to ${walletName} wallet`);
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
      if (!isConnected || !walletKeys || !address) {
        handleWalletNotExists('Sign Arbitrary');
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
    [walletKeys?.hex],
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
