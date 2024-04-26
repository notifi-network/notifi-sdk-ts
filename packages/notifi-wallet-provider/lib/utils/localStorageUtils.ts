import {
  Ethereum,
  KeplrWalletKeys,
  MetamaskWalletKeys,
  NotifiWalletStorage,
  Wallets,
} from '../types';

const localStorageKey = 'NotifiWalletStorage';

export const setWalletKeysToLocalStorage = <T extends keyof Wallets>(
  wallet: T,
  walletKeys: T extends 'metamask'
    ? MetamaskWalletKeys
    : T extends 'keplr'
    ? KeplrWalletKeys
    : never,
) => {
  const storageWallet: NotifiWalletStorage = {
    walletName: wallet,
    walletKeys: walletKeys,
  };
  localStorage.setItem(localStorageKey, JSON.stringify(storageWallet));
};

export const cleanWalletsInLocalStorage = () => {
  localStorage.removeItem(localStorageKey);
};

export const getWalletsFromLocalStorage = (): NotifiWalletStorage | null => {
  const storageWalletRaw = JSON.parse(
    window.localStorage.getItem(localStorageKey) ?? '{}',
  );
  let storageWallet: NotifiWalletStorage | null = null;
  if ('walletName' in storageWalletRaw) {
    storageWallet = storageWalletRaw as NotifiWalletStorage;
  }
  return storageWallet;
};

export function getProvider(
  walletType: 'isMetaMask' | 'isCoinbaseWallet' | 'isRabby',
): Ethereum | undefined {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Array.isArray(window.ethereum?.providers)
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.ethereum.providers.find((provider) => provider[walletType])
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ethereum?.[walletType]
    ? window.ethereum
    : undefined;
}
