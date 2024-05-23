import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
import { Wallet, WalletStrategy } from '@injectivelabs/wallet-ts';
import type { StdSignature } from '@keplr-wallet/types';
import { useCallback, useEffect, useState } from 'react';

import { LeapSignMessage, LeapWalletKeys, Wallets } from '../types';
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
      if (!window.leap) return handleLeapNotExists('handleAccountChange');

      !injectiveLeapWallet.strategies.leap
        ?.getPubKey()
        // .getKey('injective-1')
        .then(async (key) => {
          // TODO: dynamic cosmos chain id
          const accounts = await injectiveLeapWallet.getAddresses();
          const walletKeys = {
            bech32: accounts[0],
            base64: key,
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
    if (!injectiveLeapWallet.strategies.leap) {
      await injectiveLeapWallet.enable();
      handleLeapNotExists('connectLeap');
      return null;
    }

    loadingHandler(true);

    try {
      injectiveLeapWallet.setWallet(Wallet.Leap);
      const key = await injectiveLeapWallet.getPubKey();
      const accounts = await injectiveLeapWallet.getAddresses();
      const walletKeys = {
        bech32: accounts[0],
        base64: key,
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
    injectiveLeapWallet.disconnect();
    selectWallet(null);
    setWalletKeysLeap(null);
    cleanWalletsInLocalStorage();
  };

  const signArbitraryLeap = useCallback(
    async (
      message: string | Uint8Array,
      chainId?: string,
    ): Promise<void | StdSignature> => {
      if (!walletKeysLeap || !injectiveLeapWallet.strategies.leap) {
        handleLeapNotExists('signArbitraryLeap');
        return;
      }

      loadingHandler(true);

      try {
        const messageString =
          typeof message === 'string'
            ? message
            : Buffer.from(message).toString('base64');
        const result = await injectiveLeapWallet.signArbitrary(
          walletKeysLeap.bech32,
          messageString,
        );

        if (typeof result === 'string') {
          // Check if the result is a valid JSON string
          try {
            const parsedResult = JSON.parse(result);
            if (parsedResult.signature && parsedResult.pub_key) {
              return {
                signature: parsedResult.signature,
                pub_key: {
                  type: 'tendermint/PubKeySecp256k1',
                  value: parsedResult.pub_key,
                },
              } as StdSignature;
            }
          } catch (e) {
            // If JSON.parse fails, assume the result is a raw signature string
            return {
              signature: result,
              pub_key: {
                type: 'tendermint/PubKeySecp256k1',
                value: walletKeysLeap.base64,
              },
            } as StdSignature;
          }
        } else {
          console.error(
            'Unexpected result format from Leap signArbitrary:',
            result,
          );
          return;
        }
      } catch (e) {
        errorHandler(
          new Error('Leap signArbitrary failed, check console for details'),
        );
        console.error(e);
      } finally {
        loadingHandler(false);
      }
    },
    [walletKeysLeap],
  );

  // const signArbitraryLeap = useCallback(
  //   async (message: string | Uint8Array): Promise<any> => {
  //     if (!walletKeysLeap || !injectiveLeapWallet.strategies.leap) {
  //       return;
  //     }

  //     loadingHandler(true);

  //     try {
  //       const result = await injectiveLeapWallet.signArbitrary(
  //         walletKeysLeap.bech32,
  //         typeof message === 'string'
  //           ? message
  //           : Buffer.from(message).toString('base64'),
  //       );

  //       return result;
  //     } catch (e) {
  //       errorHandler(
  //         new Error('Leap signArbitrary failed, check console for details'),
  //       );
  //       console.error(e);
  //     }
  //     loadingHandler(false);
  //   },
  //   [walletKeysLeap],
  // );
  return {
    isLeapInstalled,
    walletKeysLeap,
    connectLeap,
    signArbitraryLeap,
    disconnectLeap,
    websiteURL: walletsWebsiteLink['leap'],
  };
};

const injectiveLeapWallet = new WalletStrategy({
  chainId: ChainId.Mainnet,
  wallet: Wallet.Leap,
});

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
