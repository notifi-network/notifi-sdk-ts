import { NotifiWalletStorage } from './types';

const localStorageKey = 'NotifiWalletStorage';
// TODO: move to wallet-provider package

export const cleanWalletsInLocalStorage = () => {
  console.log('Removing localStorageKey');
  localStorage.removeItem(localStorageKey);
  if (localStorage.getItem(localStorageKey)) {
    console.error('Failed to remove cache, retry');
    localStorage.removeItem(localStorageKey);
    console.log('Result', localStorage.getItem(localStorageKey));
  }
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
