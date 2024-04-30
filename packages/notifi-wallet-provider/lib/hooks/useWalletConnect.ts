import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { MetamaskWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';

const walletName: keyof Wallets = 'walletconnect';

export const useWalletConnect = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeys, setWalletKeys] = useState<MetamaskWalletKeys | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const handleWalletNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: ${walletName} not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    const walletConnectConnector = connectors.find((v) =>
      v.name.toLowerCase()?.includes('walletconnect'),
    );
    setIsWalletInstalled(!!walletConnectConnector);
  }, [connectors]);

  useEffect(() => {
    if (!isConnected || !address) return;

    const walletKeys = {
      bech32: converter('inj').toBech32(address),
      hex: address,
    };
    setWalletKeys(walletKeys);
    selectWallet(walletName);
    setWalletKeysToLocalStorage(walletName as keyof Wallets, walletKeys);
  }, [address]);

  const connectWallet = async (
    timeoutInMiniSec?: number,
  ): Promise<MetamaskWalletKeys | null> => {
    if (isConnected) return null;

    loadingHandler(true);
    const timer = setTimeout(() => {
      disconnectWallet();
      loadingHandler(false);
    }, timeoutInMiniSec ?? 5000);

    try {
      const walletConnectConnector = connectors.find((v) =>
        v.name.toLowerCase()?.includes(walletName),
      );
      if (!walletConnectConnector) return null;
      connect({ connector: walletConnectConnector });
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
        handleWalletNotExists('signArbitrary');
        return;
      }

      loadingHandler(true);
      const timer = setTimeout(() => {
        loadingHandler(false);
      }, 5000);

      try {
        const signature: `0x${string}` = await signMessageAsync({
          message: Buffer.from(message).toString('hex'),
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
  };
};
