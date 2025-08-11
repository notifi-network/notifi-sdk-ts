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
  selectedWallet: keyof Wallets | null,
  walletName: keyof Wallets,
) => {
  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  // TODO: figure out config
  const { sendTransactionAsync } = useSendTransaction();
  const { address, isConnected: isWalletConnected, connector } = useAccount();
  const {
    connect,
    connectors,
    error: connectError,
    isPending: isConnecting,
    isSuccess: isNewlyConnected,
  } = useConnect();

  // useEffect(() => {
  //   console.log(10, { isSuccessfullyConnected, isWalletConnected, address });
  // }, [isSuccessfullyConnected]);

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
    setIsWalletInstalled(!!provider);
  }, [connectors]);

  // useEffect(() => {
  //   // if (!address || !isWalletInstalled) return;
  //   console.log(10, { isNewlyConnected, address });
  //   // if (!address || !isSuccessfullyConnected || selectedWallet !== walletName)
  //   if (!address || !isNewlyConnected || selectedWallet !== walletName) return;
  //   // if (isConnected) {
  //   // if (isSuccessfullyConnected) {
  //   const walletKeys = {
  //     bech32: converter('inj').toBech32(address),
  //     hex: address,
  //   };
  //   setWalletKeys(walletKeys);
  //   // selectWallet(walletName);
  //   setWalletKeysToLocalStorage(walletName, walletKeys);
  //   //   return;
  //   // }
  //   // disconnect();
  // }, [address, isNewlyConnected, selectedWallet]);
  // // }, [address, isWalletInstalled, isConnected]);

  useEffect(() => {
    if (
      !isConnected ||
      !address ||
      !isWalletInstalled ||
      selectedWallet !== walletName
    )
      return;

    const walletKeys = {
      bech32: converter('inj').toBech32(address),
      hex: address,
    };
    setWalletKeys(walletKeys);
    console.log(3, 'setLocalStorage', { walletName, walletKeys });
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

  const connectWallet = async () // timeoutInMiniSec?: number,
  : Promise<MetamaskWalletKeys | null> => {
    /* ⬇  Disable for now because of the viem issue (isWalletConnected turns true even if the wallet is not connected) */
    // if (isWalletConnected) return null;

    // loadingHandler(true);
    // const timer = setTimeout(() => {
    //   disconnectWallet();
    //   loadingHandler(false);
    // }, timeoutInMiniSec ?? 0);

    // try {
    const provider = connectors.find((v) =>
      v.name.toLowerCase()?.includes(walletName),
    );
    console.log(4, 'gone through connectWallet', provider);
    // if (!provider) return null;
    if (!provider) {
      const errorMsg = `useWagmiWallets - ${walletName} not initialized or not installed`;
      console.error(errorMsg);
      errorHandler(new Error(errorMsg), 5000);
      return null;
    }
    console.log(5, 'provider', provider);
    selectWallet(walletName);
    connect({ connector: provider });
    return null;
    // } catch (e: unknown) {
    //   console.log(1, 'error in connectWallet', e);
    //   console.error(e);
    //   disconnectWallet();
    //   if (e instanceof Error) {
    //     errorHandler(new Error(e.message));
    //   }
    //   return null;
    // } finally {
    //   loadingHandler(false);
    //   clearTimeout(timer);
    // }
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
    [walletKeys?.hex, address, isConnected],
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
