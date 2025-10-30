import React from 'react';

import type { WalletOptions } from '../context/NotifiWallets';
import { type BinanceWalletHookType, useBinance } from '../hooks/useBinance';
import {
  type InjectedWalletHookType,
  useInjectedWallet,
} from '../hooks/useInjectedWallet';
import { type KeplrWalletHookType, useKeplr } from '../hooks/useKeplr';
import { type PhantomWalletHookType, usePhantom } from '../hooks/usePhantom';
import {
  type WagmiWalletHookType,
  useWagmiWallet,
} from '../hooks/useWagmiWallet';
import { type XionWalletHookType, useXion } from '../hooks/useXion';
import { Wallets } from '../types';
import {
  INTEGRATION_WALLETS,
  InjectedWalletName,
  WagmiWalletName,
} from '../utils/walletConfigs';

export type WalletHookParams = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  throwError: (error: Error, duration?: number) => void;
  selectWallet: (wallet: keyof Wallets | null) => void;
  selectedWallet: keyof Wallets | null;
  walletOptions?: WalletOptions;
};

// Create injected wallet hooks
export const createInjectedWalletHooks = (params: WalletHookParams) => {
  const { setIsLoading, throwError, selectWallet, walletOptions } = params;
  const hooks: Partial<Record<InjectedWalletName, InjectedWalletHookType>> = {};

  INTEGRATION_WALLETS.injected.forEach((walletName) => {
    hooks[walletName] = useInjectedWallet(
      setIsLoading,
      throwError,
      selectWallet,
      walletName,
      walletOptions?.evm,
    );
  });

  return hooks;
};

// Create wagmi wallet hooks
export const createWagmiWalletHooks = (params: WalletHookParams) => {
  const {
    setIsLoading,
    throwError,
    selectWallet,
    selectedWallet,
    walletOptions,
  } = params;
  const hooks: Partial<Record<WagmiWalletName, WagmiWalletHookType>> = {};

  INTEGRATION_WALLETS.wagmi.forEach((walletName) => {
    hooks[walletName] = useWagmiWallet(
      setIsLoading,
      throwError,
      selectWallet,
      selectedWallet,
      walletName,
      walletOptions?.evm,
    );
  });

  return hooks;
};

// Create special wallet hooks
export const createSpecialWalletHooks = (params: WalletHookParams) => {
  const { setIsLoading, throwError, selectWallet, walletOptions } = params;

  return {
    keplr: useKeplr(
      setIsLoading,
      throwError,
      selectWallet,
      walletOptions?.keplr,
    ) as KeplrWalletHookType,
    binance: useBinance(
      setIsLoading,
      throwError,
      selectWallet,
    ) as BinanceWalletHookType,
    phantom: usePhantom(
      setIsLoading,
      throwError,
      selectWallet,
    ) as PhantomWalletHookType,
    xion: useXion(
      setIsLoading,
      throwError,
      selectWallet,
      'xion',
    ) as XionWalletHookType,
  };
};

// Create all wallet hooks
export const createWalletHooks = (params: WalletHookParams) => {
  const injectedHooks = createInjectedWalletHooks(params);
  const wagmiHooks = createWagmiWalletHooks(params);
  const specialHooks = createSpecialWalletHooks(params);

  return {
    ...injectedHooks,
    ...wagmiHooks,
    ...specialHooks,
  };
};
