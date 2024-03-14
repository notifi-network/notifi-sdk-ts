import type { Keplr, StdSignature } from '@keplr-wallet/types';
import { useCallback, useEffect, useState } from 'react';

import { PickKeys, WalletKeys } from '../types';

export const useKeplr = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
) => {
  const [walletKeysKeplr, setWalletKeysKeplr] = useState<PickKeys<
    WalletKeys,
    'base64' | 'bech32'
  > | null>(null);

  const [isKeplrInstalled, setIsKeplrInstalled] = useState<boolean>(false);

  useEffect(() => {
    loadingHandler(true);
    getKeplrFromWindow()
      .then((_keplr) => {
        setIsKeplrInstalled(true);
        // https://docs.keplr.app/api/#custom-event
        window.addEventListener('keplr_keystorechange', handleAccountChange);
      })
      .catch((e) => {
        errorHandler(new Error(e));
        setIsKeplrInstalled(false);
        console.log(e);
      })
      .finally(() => loadingHandler(false));

    const handleAccountChange = () => {
      console.log('Keplr account changed');
      if (!window.keplr) return;
      window.keplr.getKey('injective-1').then((key) => {
        const walletKeys = {
          bech32: key.bech32Address,
          base64: Buffer.from(key.pubKey).toString('base64'),
        };
        setWalletKeysKeplr(walletKeys);
      });
    };

    return () => {
      window.removeEventListener('keplr_keystorechange', handleAccountChange);
    };
  }, []);

  const connectKeplr = async (
    chainId?: string,
  ): Promise<PickKeys<WalletKeys, 'bech32' | 'base64'> | null> => {
    if (!window.keplr) {
      errorHandler(new Error('Wait for initialization'));
      return null;
    }
    loadingHandler(true);
    try {
      await window.keplr.enable(chainId ?? 'injective-1');
      const key = await window.keplr.getKey(chainId ?? 'injective-1');
      const walletKeys = {
        bech32: key.bech32Address,
        base64: Buffer.from(key.pubKey).toString('base64'),
      };
      setWalletKeysKeplr(walletKeys);
      loadingHandler(false);
      return walletKeys;
    } catch (e) {
      errorHandler(
        new Error('Keplr connection failed, check console for details'),
      );
      console.error(e);
    }
    loadingHandler(false);
    return null;

    // TODO: local storage
    // const storageWallet: NotifiWalletStorage = {
    //   walletName: 'keplr',
    //   walletKeys: walletKeys,
    //   isConnected: true,
    // };
    // localStorage.setItem('NotifiWalletStorage', JSON.stringify(storageWallet));
    // NOTE: example of using injective sdk with keplr
    // const walletStrategy = new WalletStrategy({
    //   chainId: ChainId.Mainnet,
    // });
    // console.log('try keplr connect with injective sdk');
    // walletStrategy.setWallet(Wallet.Keplr);
    // const address = await walletStrategy.getAddresses();
    // const sig = await walletStrategy.signArbitrary(walletKeys.bech32, 'test');
    // console.log({ sig });
  };

  const signArbitraryKeplr = useCallback(
    async (
      message: string | Uint8Array,
      chainId?: string,
    ): Promise<StdSignature | undefined> => {
      if (!window.keplr || !walletKeysKeplr) {
        errorHandler(new Error('Keplr not initialized or not connected'));
        return;
      }
      loadingHandler(true);
      try {
        const result = await window.keplr.signArbitrary(
          chainId ?? 'injective-1',
          walletKeysKeplr?.bech32,
          message,
        );
        return result;
      } catch (e) {
        errorHandler(
          new Error('Keplr signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysKeplr],
  );
  return {
    isKeplrInstalled,
    walletKeysKeplr,
    connectKeplr,
    signArbitraryKeplr,
  };
};

const getKeplrFromWindow = async (): Promise<Keplr> => {
  if (typeof window === 'undefined' || !window.keplr) {
    throw new Error(
      'Cannot get keplr without a window | Cannot get keplr from window',
    );
  }
  if (window.keplr) {
    return window.keplr;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Keplr extension');
  }
  return new Promise<Keplr>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.keplr) {
          resolve(window.keplr);
        } else {
          reject('Please install the Keplr extension');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
