'use client';

import { useRouterAsync } from '@/hooks/useRouterAsync';
import type {
  Keplr,
  Window as KeplrWindow,
  StdSignature,
} from '@keplr-wallet/types';
import converter from 'bech32-converting';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useGlobalStateContext } from '../GlobalStateContext';

// for localStorage
export type NotifiWalletStorage = {
  walletName: keyof Wallets;
  walletKeys: Partial<WalletKeys>;
  isConnected: boolean;
};

type Ethereum = Eip1193Provider & BrowserProvider;

declare global {
  interface Window {
    keplr: Keplr;
    ethereum: Ethereum;
  }
}

abstract class NotifiWallet {
  abstract isInstalled: boolean;
  abstract walletKeys: Partial<WalletKeys> | null;
  abstract signArbitrary?: KeplrSignMessage | MetamaskSignMessage;
  abstract connect?: () => Promise<void>;
}

type WalletKeys = {
  bech32: string; // inj address (or other Cosmos chain ) ex. inj1...
  base64: string; // inj address (or other Cosmos chain ) in base64 format
  hex: string; // eth address
};

type PickKeys<T, K extends keyof T> = Pick<T, K>;

type MetamaskSignMessage = (message: string) => Promise<`0x${string}`>;
class MetamaskWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: PickKeys<WalletKeys, 'bech32' | 'hex'> | null,
    public signArbitrary: MetamaskSignMessage,
    public connect: () => Promise<void>,
  ) {}
}

type KeplrSignMessage = (message: string | Uint8Array) => Promise<StdSignature>;

class KeplrWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: PickKeys<WalletKeys, 'bech32' | 'base64'> | null,
    public signArbitrary: KeplrSignMessage,
    public connect: () => Promise<void>,
  ) {}
}

type Wallets = {
  metamask: MetamaskWallet;
  keplr: KeplrWallet;
};

type WalletContextType = {
  selectedWallet: keyof Wallets | null;
  selectWallet: (wallet: keyof Wallets) => void;
  wallets: Wallets;
};

const WalletContext = createContext<WalletContextType>({
  selectedWallet: null,
  selectWallet: () => {
    console.log('Not implemented');
  },
  wallets: {
    metamask: {} as any, // TODO: handle type
    keplr: {} as any, // TODO: handle type
  },
});

export const useWallets = () => React.useContext(WalletContext);

const getMetamaskFromWindow = async (): Promise<Ethereum> => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot get Metamask without a window');
  }

  const win = window;
  const metamask = win.ethereum as Ethereum;
  if (metamask) {
    return metamask;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Metamask extension');
  }

  return new Promise<Ethereum>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        const innerMetamask = win.ethereum as Ethereum;
        if (innerMetamask) {
          resolve(innerMetamask);
        } else {
          reject('Please install the Metamask extension');
        }

        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };

    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};

/* Note: Only browser extension is supported for now */
const getKeplrFromWindow = async (): Promise<Keplr> => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot get keplr without a window');
  }

  const win = window as KeplrWindow;
  const keplr = win.keplr;
  if (keplr) {
    return keplr;
  } else if (document.readyState === 'complete') {
    throw new Error('Please install the Keplr extension');
  }

  return new Promise<Keplr>((resolve, reject) => {
    const onDocumentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        const innerKeplr = win.keplr;
        if (innerKeplr) {
          resolve(innerKeplr);
        } else {
          reject('Please install the Keplr extension');
        }

        document.removeEventListener('readystatechange', onDocumentStateChange);
      }
    };

    document.addEventListener('readystatechange', onDocumentStateChange);
  });
};

const NotifiWalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedWallet, setSelectedWallet] = useState<
    'metamask' | 'keplr' | null
  >(null);

  const selectWallet = (wallet: 'metamask' | 'keplr') => {
    setSelectedWallet(wallet);
  };

  const [metamask, setMetamask] = useState<Ethereum | null>(null);
  const [walletKeysMetamask, setWalletKeysMetamask] = useState<PickKeys<
    WalletKeys,
    'hex' | 'bech32'
  > | null>(null);
  const [isMetamaskInstalled, setIsMetamaskInstalled] =
    useState<boolean>(false);

  const { popGlobalInfoModal } = useGlobalStateContext();

  useEffect(() => {
    getMetamaskFromWindow()
      .then((metamask) => {
        setMetamask(metamask);
        setIsMetamaskInstalled(true);
        metamask?.on('accountsChanged', handleAccountChange);
      })
      .catch((e) => {
        popGlobalInfoModal({
          message:
            'Please install the Metamask extension, check detailed error in console',
          iconOrEmoji: { type: 'icon', id: 'warning' },
          timeout: 5000,
        });
        setIsMetamaskInstalled(false);
        console.log(e);
      });
    // TODO: check dependencies
    // https://docs.metamask.io/wallet/reference/provider-api/#events
    const handleAccountChange = () => {
      console.log('Account changed');
      handleRoute('/');
    };
    return () => {
      metamask?.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  // impl connectWallet method
  const connectMetamask = async () => {
    // const metamask = await getMetamaskFromWindow();
    if (!metamask) {
      throw new Error('Metamask not initialized');
    }

    const accounts = await metamask.request({ method: 'eth_requestAccounts' });

    const walletKeys = {
      bech32: converter('inj').toBech32(accounts[0]),
      hex: accounts[0],
    };

    setWalletKeysMetamask(walletKeys);

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
    async (message: string): Promise<`0x${string}`> => {
      if (!metamask) {
        throw new Error('Metamask not initialized');
      }
      // const metamask = await getMetamaskFromWindow();
      // TODO: handle error
      const signature: Promise<`0x${string}`> = await metamask.request({
        method: 'personal_sign',
        // A hex-encoded UTF-8 string to present to the user. See how to encode a string like this in the browser-string-hexer module.
        // TODO: hex encode the message
        params: [Buffer.from(message).toString('hex'), walletKeysMetamask?.hex],
      });
      // A hex-encoded 129-byte array starting with 0x.
      return signature;
    },
    [walletKeysMetamask?.hex, metamask],
  );

  const [keplr, setKeplr] = useState<Keplr | null>(null);
  const [walletKeysKeplr, setWalletKeysKeplr] = useState<PickKeys<
    WalletKeys,
    'base64' | 'bech32'
  > | null>(null);
  const [isKeplrInstalled, setIsKeplrInstalled] = useState<boolean>(false);
  const { handleRoute } = useRouterAsync();

  useEffect(() => {
    getKeplrFromWindow()
      .then((keplr) => {
        setKeplr(keplr);
        setIsKeplrInstalled(true);
      })
      .catch((e) => {
        popGlobalInfoModal({
          message:
            'Please install the Keplr extension, check detailed error in console',
          iconOrEmoji: { type: 'icon', id: 'warning' },
          timeout: 5000,
        });
        setIsKeplrInstalled(false);
        console.log(e);
      });
    // TODO: check dependencies
    // https://docs.keplr.app/api/#custom-event
    const accountChangeListener = window.addEventListener(
      'keplr_keystorechange',
      () => {
        console.log('Account changed');
        handleRoute('/');
      },
    );
    return accountChangeListener;
  }, []);
  const connectKeplr = useCallback(async () => {
    if (!keplr) {
      throw new Error('Wait for initialization');
    }

    await keplr.enable('injective-1');
    const key = await keplr.getKey('injective-1');
    console.log('set wallet keys');

    const walletKeys = {
      bech32: key.bech32Address,
      base64: Buffer.from(key.pubKey).toString('base64'),
    };
    setWalletKeysKeplr(walletKeys);

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
  }, [keplr]);

  const signArbitraryKeplr = useCallback(
    async (message: string | Uint8Array): Promise<StdSignature> => {
      if (keplr && walletKeysKeplr) {
        const result = await keplr.signArbitrary(
          'injective-1',
          walletKeysKeplr?.bech32,
          message,
        );
        return result;
      }
      throw new Error('ERROR: SignArbitrary Fail - Keplr');
    },
    [keplr, walletKeysKeplr],
  );

  return (
    <WalletContext.Provider
      value={{
        selectedWallet,
        selectWallet,
        wallets: {
          metamask: new MetamaskWallet(
            isMetamaskInstalled,
            walletKeysMetamask,
            signArbitraryMetamask,
            connectMetamask,
          ),
          keplr: new KeplrWallet(
            isKeplrInstalled,
            walletKeysKeplr,
            signArbitraryKeplr,
            connectKeplr,
          ),
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default NotifiWalletProvider;
