import {
  CardanoWalletKeys,
  CosmosWalletKeys,
  EvmWalletKeys,
  NotifiWalletStorage,
  SolanaWalletKeys,
  Wallets,
} from '../types';

const localStorageKey = 'NotifiWalletStorage';

export const setWalletKeysToLocalStorage = <T extends keyof Wallets>(
  wallet: T,
  walletKeys: T extends 'metamask'
    ? EvmWalletKeys
    : T extends 'keplr'
      ? CosmosWalletKeys
      : T extends 'phantom'
        ? SolanaWalletKeys
        : T extends 'lace'
          ? CardanoWalletKeys
          : T extends 'eternl'
            ? CardanoWalletKeys
            : T extends 'nufi'
              ? CardanoWalletKeys
              : T extends 'okx-cardano'
                ? CardanoWalletKeys
                : T extends 'yoroi'
                  ? CardanoWalletKeys
                  : T extends 'ctrl'
                    ? CardanoWalletKeys
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
  try {
    const storageWalletRaw = JSON.parse(
      window.localStorage.getItem(localStorageKey) ?? '{}',
    );
    if ('walletName' in storageWalletRaw) {
      return storageWalletRaw as NotifiWalletStorage;
    }
    return null;
  } catch {
    return null;
  }
};
