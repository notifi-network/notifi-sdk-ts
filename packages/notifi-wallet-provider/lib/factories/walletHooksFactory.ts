import React from 'react';

import type { WalletOptions } from '../context/NotifiWallets';
import { useBinance } from '../hooks/useBinance';
import { useInjectedWallet } from '../hooks/useInjectedWallet';
import { useKeplr } from '../hooks/useKeplr';
import { usePhantom } from '../hooks/usePhantom';
import { useWagmiWallet } from '../hooks/useWagmiWallet';
import { useXion } from '../hooks/useXion';
import { Wallets } from '../types';

export type WalletHookParams = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  throwError: (error: Error, duration?: number) => void;
  selectWallet: (wallet: keyof Wallets | null) => void;
  selectedWallet: keyof Wallets | null;
  walletOptions?: WalletOptions;
};

export const createWalletHooks = (params: WalletHookParams) => {
  const {
    setIsLoading,
    throwError,
    selectWallet,
    selectedWallet,
    walletOptions,
  } = params;

  // Wagmi wallets
  const walletConnect = useWagmiWallet(
    setIsLoading,
    throwError,
    selectWallet,
    selectedWallet,
    'walletconnect',
    walletOptions?.evm,
  );

  const coinbase = useWagmiWallet(
    setIsLoading,
    throwError,
    selectWallet,
    selectedWallet,
    'coinbase',
    walletOptions?.evm,
  );

  // Injected wallets
  const metamask = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'metamask',
    walletOptions?.evm,
  );

  const okx = useInjectedWallet(setIsLoading, throwError, selectWallet, 'okx');

  const zerion = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'zerion',
    walletOptions?.evm,
  );

  const rabby = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rabby',
    walletOptions?.evm,
  );

  const rainbow = useInjectedWallet(
    setIsLoading,
    throwError,
    selectWallet,
    'rainbow',
    walletOptions?.evm,
  );

  // Native integration wallets
  const keplr = useKeplr(
    setIsLoading,
    throwError,
    selectWallet,
    walletOptions?.keplr,
  );

  const binance = useBinance(setIsLoading, throwError, selectWallet);
  const phantom = usePhantom(setIsLoading, throwError, selectWallet);

  // Xion wallet
  const xion = useXion(setIsLoading, throwError, selectWallet, 'xion');

  return {
    walletConnect,
    coinbase,
    metamask,
    okx,
    zerion,
    rabby,
    rainbow,
    keplr,
    binance,
    phantom,
    xion,
  };
};
