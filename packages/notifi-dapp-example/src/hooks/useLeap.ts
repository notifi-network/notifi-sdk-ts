import {
  cleanWalletsInLocalStorage,
  setWalletKeysToLocalStorage,
} from '@/utils/localStorageUtils';
import { LeapWalletKeys, Wallets } from '@/utils/types';
import { ChainId } from '@injectivelabs/ts-types';
import { Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';
import type { StdSignature } from '@keplr-wallet/types';
import { useCallback, useEffect, useState } from 'react';

export const useLeap = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
  selectWallet: (wallet: keyof Wallets | null) => void,
) => {
  const [walletKeysLeap, setWalletKeysLeap] = useState<LeapWalletKeys | null>(
    null,
  );
  const [isLeapInstalled, setIsLeapInstalled] = useState<boolean>(false);

  const leap = new WalletStrategy({
    chainId: ChainId.Mainnet,
  });

  leap.setWallet(Wallet.Leap);

  const handleLeapNotExists = (location: string) => {
    cleanWalletsInLocalStorage();
    errorHandler(
      new Error(
        `ERROR - ${location}: window.Leap not initialized or not installed`,
      ),
    );
  };

  useEffect(() => {
    loadingHandler(true);
    getLeapFromWindow()
      .then((_Leap) => {
        setIsLeapInstalled(true);
        // https://docs.leap.app/api/#custom-event
        window.addEventListener('leap_keystorechange', handleAccountChange);
      })
      .catch((e) => {
        errorHandler(new Error(e));
        setIsLeapInstalled(false);
        console.log(e);
      })
      .finally(() => loadingHandler(false));

    const handleAccountChange = () => {
      leap.onAccountChange(() => {
        window.leap.getKey('injective-1').then((key) => {
          // TODO: dynamic cosmos chain id
          const walletKeys = {
            bech32: key.bech32Address,
            base64: Buffer.from(key.pubKey).toString('base64'),
          };
          setWalletKeysLeap(walletKeys);
        });
      });
    };

    return () => {
      window.removeEventListener('leap_keystorechange', handleAccountChange);
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
    leap.disconnect();
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
  };
};

const getLeapFromWindow = async (): Promise<Wallet.Leap> => {
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
  return new Promise<Wallet.Leap>((resolve, reject) => {
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
