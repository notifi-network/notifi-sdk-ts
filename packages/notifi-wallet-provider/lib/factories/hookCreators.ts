import React from 'react';

import type { WalletOptions } from '../context/NotifiWallets';
import { type BinanceWalletHookType, useBinance } from '../hooks/useBinance';
import { type CtrlWalletHookType, useCtrl } from '../hooks/useCtrl';
import { type EternlWalletHookType, useEternl } from '../hooks/useEternl';
import { useInjectedWallet } from '../hooks/useInjectedWallet';
import { type KeplrWalletHookType, useKeplr } from '../hooks/useKeplr';
import { type LaceWalletHookType, useLace } from '../hooks/useLace';
import { type NufiWalletHookType, useNufi } from '../hooks/useNufi';
import {
  type OkxCardanoWalletHookType,
  useOkxCardano,
} from '../hooks/useOkxCardano';
import { type PhantomWalletHookType, usePhantom } from '../hooks/usePhantom';
import { useWagmiWallet } from '../hooks/useWagmiWallet';
import { type YoroiWalletHookType, useYoroi } from '../hooks/useYoroi';
import { Wallets } from '../types';

export type WalletHookParams = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  throwError: (error: Error, duration?: number) => void;
  selectWallet: (wallet: keyof Wallets | null) => void;
  selectedWallet: keyof Wallets | null;
  walletOptions?: WalletOptions;
};

// Use injected wallet hooks
export const useInjectedWalletHooks = (params: WalletHookParams) => {
  const { setIsLoading, throwError, selectWallet, walletOptions } = params;
  const evmOptions = walletOptions?.evm;

  return {
    metamask: useInjectedWallet(
      setIsLoading,
      throwError,
      selectWallet,
      'metamask',
      evmOptions,
    ),
    okx: useInjectedWallet(
      setIsLoading,
      throwError,
      selectWallet,
      'okx',
      evmOptions,
    ),
    zerion: useInjectedWallet(
      setIsLoading,
      throwError,
      selectWallet,
      'zerion',
      evmOptions,
    ),
    rabby: useInjectedWallet(
      setIsLoading,
      throwError,
      selectWallet,
      'rabby',
      evmOptions,
    ),
    rainbow: useInjectedWallet(
      setIsLoading,
      throwError,
      selectWallet,
      'rainbow',
      evmOptions,
    ),
  };
};

// Use wagmi wallet hooks
export const useWagmiWalletHooks = (params: WalletHookParams) => {
  const {
    setIsLoading,
    throwError,
    selectWallet,
    selectedWallet,
    walletOptions,
  } = params;
  const evmOptions = walletOptions?.evm;

  return {
    walletconnect: useWagmiWallet(
      setIsLoading,
      throwError,
      selectWallet,
      selectedWallet,
      'walletconnect',
      evmOptions,
    ),
    coinbase: useWagmiWallet(
      setIsLoading,
      throwError,
      selectWallet,
      selectedWallet,
      'coinbase',
      evmOptions,
    ),
  };
};

// Use special wallet hooks
export const useSpecialWalletHooks = (params: WalletHookParams) => {
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
    lace: useLace(setIsLoading, throwError, selectWallet) as LaceWalletHookType,
    eternl: useEternl(
      setIsLoading,
      throwError,
      selectWallet,
    ) as EternlWalletHookType,
    nufi: useNufi(setIsLoading, throwError, selectWallet) as NufiWalletHookType,
    'okx-cardano': useOkxCardano(
      setIsLoading,
      throwError,
      selectWallet,
    ) as OkxCardanoWalletHookType,
    yoroi: useYoroi(
      setIsLoading,
      throwError,
      selectWallet,
    ) as YoroiWalletHookType,
    ctrl: useCtrl(setIsLoading, throwError, selectWallet) as CtrlWalletHookType,
  };
};

// Compose all wallet hooks
export const useAllWalletHooks = (params: WalletHookParams) => {
  const injectedHooks = useInjectedWalletHooks(params);
  const wagmiHooks = useWagmiWalletHooks(params);
  const specialHooks = useSpecialWalletHooks(params);

  return {
    ...injectedHooks,
    ...wagmiHooks,
    ...specialHooks,
  };
};
