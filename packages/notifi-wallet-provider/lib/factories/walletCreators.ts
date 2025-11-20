import { type BinanceWalletHookType } from '../hooks/useBinance';
import { type InjectedWalletHookType } from '../hooks/useInjectedWallet';
import { type KeplrWalletHookType } from '../hooks/useKeplr';
import { PhantomWalletHookType } from '../hooks/usePhantom';
import { type WagmiWalletHookType } from '../hooks/useWagmiWallet';
import { type XionWalletHookType } from '../hooks/useXion';
import {
  BinanceWallet,
  EvmWallet,
  KeplrWallet,
  PhantomWallet,
  XionWallet,
} from '../types';

// Generic EVM wallet creation function
export const createEvmWallet = (
  hook: InjectedWalletHookType | WagmiWalletHookType,
): EvmWallet => {
  return new EvmWallet(
    hook.isWalletInstalled,
    hook.walletKeys,
    hook.signArbitrary,
    hook.connectWallet,
    hook.disconnectWallet,
    hook.websiteURL,
    hook.sendTransaction,
  );
};

// Binance wallet creation function
export const createBinanceWallet = (
  hook: BinanceWalletHookType,
): BinanceWallet => {
  return new BinanceWallet(
    hook.isWalletInstalled,
    hook.walletKeys,
    hook.signArbitrary,
    hook.connectWallet,
    hook.disconnectWallet,
    hook.websiteURL,
    hook.sendTransaction,
  );
};

// Keplr wallet creation function
export const createKeplrWallet = (hook: KeplrWalletHookType): KeplrWallet => {
  return new KeplrWallet(
    hook.isKeplrInstalled,
    hook.walletKeysKeplr,
    hook.signArbitraryKeplr,
    hook.connectKeplr,
    hook.disconnectKeplr,
    hook.websiteURL,
  );
};

// Xion wallet creation function
export const createXionWallet = (hook: XionWalletHookType): XionWallet => {
  return new XionWallet(
    hook.isWalletInstalled,
    hook.walletKeys,
    hook.signArbitrary,
    hook.connectWallet,
    hook.disconnectWallet,
    hook.websiteURL,
  );
};

// Phantom wallet creation function
export const createPhantomWallet = (
  hook: PhantomWalletHookType,
): PhantomWallet => {
  return new PhantomWallet(
    hook.isPhantomInstalled,
    hook.walletKeysPhantom,
    hook.signArbitraryPhantom,
    hook.connectPhantom,
    hook.disconnectPhantom,
    hook.websiteURL,
    hook.signTransactionPhantom,
    hook.signHardwareTransactionPhantom,
  );
};

// Midnight wallet creation function
export const createMidnightWallet = (
  hook: MidnightWalletHookType,
): MidnightWallet => {
  return new MidnightWallet(
    hook.isMidnightInstalled,
    hook.walletKeysMidnight,
    hook.signArbitraryMidnight,
    hook.connectMidnight,
    hook.disconnectMidnight,
    hook.websiteURL,
  );
};
