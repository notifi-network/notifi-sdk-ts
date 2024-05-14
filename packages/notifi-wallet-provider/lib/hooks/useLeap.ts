import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
import { Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';
import type { StdSignature } from '@keplr-wallet/types';
import { useCallback, useEffect, useState } from 'react';

import { LeapWalletKeys, Wallets } from '../types';
import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '../utils/localStorageUtils';
import { walletsWebsiteLink } from '../utils/wallet';

export const useLeap = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeysLeap, setWalletKeysLeap] = useState<LeapWalletKeys | null>(
    null,
  );

  const [isLeapInstalled, setIsLeapInstalled] = useState<boolean>(false);

  const handleLeapNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.leap not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    loadingHandler(true);
    getLeapFromWindow()
      .then((_leap) => {
        setIsLeapInstalled(true);
        // https://docs.leapwallet.io/cosmos/for-dapps-connect-to-leap/add-leap-to-a-new-dapp
        window.addEventListener('leap_keystorechange', handleAccountChange);
      })
      .catch((e) => {
        setIsLeapInstalled(false);
        console.error(e);
      })
      .finally(() => loadingHandler(false));

    const handleAccountChange = () => {
      console.log('Leap account changed');
      if (!window.leap) return handleLeapNotExists('handleAccountChange');

      (window.leap as { getKey: (chainId: string) => Promise<any> })
        .getKey('injective-1')
        .then(async (key) => {
          // TODO: dynamic cosmos chain id
          const walletKeys = {
            bech32: key.bech32Address,
            base64: Buffer.from(key.pubKey).toString('base64'),
          };
          setWalletKeysLeap(walletKeys);
        });
    };

    return () => {
      window.removeEventListener('leap_keystorechange', handleAccountChange);
      loadingHandler(false);
    };
  }, []);

  const connectLeap = async (
    // TODO: dynamic cosmos chain id (Rather than passing in the chainId to the function, it should be provided by the context provider level)
    chainId?: string,
  ): Promise<LeapWalletKeys | null> => {
    if (!window.leap) {
      handleLeapNotExists('connectLeap');
      return null;
    }
    loadingHandler(true);
    try {
      await window.leap.enable(chainId ?? 'injective-1');
      const key = await window.leap.getKey(chainId ?? 'injective-1');
      const walletKeys = {
        bech32: key.bech32Address,
        base64: Buffer.from(key.pubKey).toString('base64'),
      };
      selectWallet('leap');
      setWalletKeysLeap(walletKeys);
      setWalletKeysToLocalStorage('leap', walletKeys);
      loadingHandler(false);
      return walletKeys;
    } catch (e) {
      errorHandler(
        new Error('Leap connection failed, check console for details'),
      );
      console.error(e);
    }
    loadingHandler(false);
    return null;
  };

  const disconnectLeap = () => {
    if (!window.leap) return handleLeapNotExists('disconnectLeap');
    // window.leap.disable(); // TODO fix: https://docs.leapwallet.io/cosmos/for-dapps-connect-to-leap/api-reference#disconnect-from-dapp
    setWalletKeysLeap(null);
    cleanWalletsInLocalStorage();
    selectWallet(null);
  };

  const signArbitraryLeap = useCallback(
    async (
      message: string | Uint8Array,
      chainId?: string,
    ): Promise<StdSignature | undefined> => {
      if (!window.leap || !walletKeysLeap) {
        handleLeapNotExists('signArbitraryLeap');
        return;
      }
      loadingHandler(true);
      try {
        const result = await window.leap.signArbitrary(
          chainId ?? 'injective-1',
          walletKeysLeap?.bech32,
          message,
        );
        return result;
      } catch (e) {
        errorHandler(
          new Error('Leap signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysLeap],
  );
  return {
    isLeapInstalled,
    walletKeysLeap,
    connectLeap,
    signArbitraryLeap,
    disconnectLeap,
    websiteURL: walletsWebsiteLink['leap'],
  };
};

const getLeapFromWindow = async (): Promise<any> => {
  if (typeof window === 'undefined' || !window.leap) {
    throw new Error(
      'Cannot get leap without a window | Cannot get leap from window',
    );
  }
  if (window.leap) {
    return window.leap;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Leap extension');
  }
  return new Promise<any>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.leap) {
          resolve(window.leap);
        } else {
          reject('Please install the Leap extension');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
