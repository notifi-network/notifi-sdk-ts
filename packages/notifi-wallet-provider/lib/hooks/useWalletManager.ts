import { useModal } from '@burnt-labs/abstraxion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { WalletOptions } from '../context/NotifiWallets';
import { createWalletHooks } from '../factories/walletHooksFactory';
import { createWallets } from '../factories/walletInstanceFactory';
import { Wallets } from '../types';
import { getWalletsFromLocalStorage } from '../utils/localStorageUtils';

let timer: number | NodeJS.Timeout;

export const useWalletManager = (walletOptions?: WalletOptions) => {
  const [selectedWallet, setSelectedWallet] = useState<keyof Wallets | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticationVerified, setIsAuthenticationVerified] =
    useState<boolean>(false);
  const [, setShowModal]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ] = useModal();

  const isReloaded = useRef(false);

  const selectWallet = useCallback((wallet: keyof Wallets | null) => {
    setSelectedWallet(wallet);
  }, []);

  const throwError = useCallback((e: Error, durationInMs?: number) => {
    clearTimeout(timer);
    setError(e);
    timer = setTimeout(() => {
      setError(null);
    }, durationInMs ?? 5000);
  }, []);

  // Create wallet hooks
  const walletHooks = createWalletHooks({
    setIsLoading,
    throwError,
    selectWallet,
    selectedWallet,
    walletOptions,
  });

  // Create wallet instances
  const wallets = createWallets(walletHooks);

  // Auto-connect wallet on reload
  useEffect(() => {
    const storageWallet = getWalletsFromLocalStorage();
    if (storageWallet) {
      const walletName = storageWallet.walletName;
      if (
        Object.keys(wallets).includes(walletName) &&
        wallets[walletName].isInstalled &&
        !selectedWallet &&
        walletName !== 'xion' &&
        !isReloaded.current
      ) {
        wallets[walletName].connect();
        isReloaded.current = true;
      }
    }
  }, [wallets, selectedWallet]);

  // Authentication verification
  useEffect(() => {
    const storageWallet = getWalletsFromLocalStorage();
    const walletName = storageWallet?.walletName;

    if (walletName) {
      if (selectedWallet) setIsAuthenticationVerified(true);
    } else {
      setIsAuthenticationVerified(true);
    }
  }, [selectedWallet]);

  return {
    selectedWallet,
    selectWallet,
    wallets,
    error,
    isLoading,
    isAuthenticationVerified,
    setShowModal,
  };
};
