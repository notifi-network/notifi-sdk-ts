import converter from 'bech32-converting';
import { useCallback, useEffect, useState } from 'react';

import { Ethereum, PickKeys, WalletKeys } from '../types';

export const useMetamask = (
  loadingHandler: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandler: (e: Error, durationInMs?: number) => void,
) => {
  const [walletKeysMetamask, setWalletKeysMetamask] = useState<PickKeys<
    WalletKeys,
    'hex' | 'bech32'
  > | null>(null);
  const [isMetamaskInstalled, setIsMetamaskInstalled] =
    useState<boolean>(false);

  useEffect(() => {
    loadingHandler(true);
    getWalletFromWindow()
      .then((metamask) => {
        setIsMetamaskInstalled(true);
        metamask.on('accountsChanged', handleAccountChange);
      })
      .catch((e) => {
        errorHandler(new Error(e));
        setIsMetamaskInstalled(false);
      })
      .finally(() => loadingHandler(false));
    const handleAccountChange = () => {
      console.log('Metamask account changed');

      if (!window.ethereum) return;
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          const walletKeys = {
            bech32: converter('inj').toBech32(accounts[0]),
            hex: accounts[0],
          };
          setWalletKeysMetamask(walletKeys);
        });
    };
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  const connectMetamask = async () => {
    if (!window.ethereum) {
      errorHandler(new Error('Metamask not initialized'));
      return;
    }
    loadingHandler(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const walletKeys = {
        bech32: converter('inj').toBech32(accounts[0]),
        hex: accounts[0],
      };
      setWalletKeysMetamask(walletKeys);
    } catch (e) {
      errorHandler(
        new Error('Metamask connection failed, check console for details'),
      );
      console.error(e);
    }
    loadingHandler(false);

    // TODO: local storage
    // const storageWallet: NotifiWalletStorage = {
    //   walletName: 'metamask',
    //   walletKeys: walletKeys,
    //   isConnected: true,
    // };
    // localStorage.setItem('NotifiWalletStorage', JSON.stringify(storageWallet));
  };
  // impl signArbitrary method
  const signArbitraryMetamask = useCallback(
    async (message: string): Promise<`0x${string}` | undefined> => {
      if (!window.ethereum || !walletKeysMetamask) {
        errorHandler(new Error('Metamask not initialized or not connected'));
        return;
      }
      loadingHandler(true);
      try {
        const signature: Promise<`0x${string}`> = await window.ethereum.request(
          {
            method: 'personal_sign',
            // A hex-encoded UTF-8 string to present to the user. See how to encode a string like this in the browser-string-hexer module.
            // TODO: hex encode the message
            params: [
              Buffer.from(message).toString('hex'),
              walletKeysMetamask?.hex,
            ],
          },
        );
        // A hex-encoded 129-byte array starting with 0x.
        return signature;
      } catch (e) {
        errorHandler(
          new Error('Metamask signArbitrary failed, check console for details'),
        );
        console.error(e);
      }
      loadingHandler(false);
    },
    [walletKeysMetamask?.hex],
  );

  return {
    walletKeysMetamask,
    isMetamaskInstalled,
    connectMetamask,
    signArbitraryMetamask,
  };
};

export const getWalletFromWindow = async (): Promise<Ethereum> => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot get Metamask without a window');
  }
  if (window.ethereum) {
    return window.ethereum;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Metamask extension');
  }

  return new Promise<Ethereum>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (window.ethereum) {
          resolve(window.ethereum);
        } else {
          reject('Please install the Metamask extension');
        }
        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };
    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};
