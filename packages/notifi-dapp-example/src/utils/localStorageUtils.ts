import { NotifiWalletStorage } from './types';

const localStorageKey = 'NotifiWalletStorage';
// TODO: move to wallet-provider package

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
