import { Wallets } from '../types';
import { BLOCKCHAIN_WALLETS } from '../utils/walletConfigs';
import { createWalletHooks } from './hookCreators';
import {
  createBinanceWallet,
  createEvmWallet,
  createKeplrWallet,
  createLaceWallet,
  createPhantomWallet,
  createXionWallet,
} from './walletCreators';

type WalletHooks = ReturnType<typeof createWalletHooks>;

export const createWallets = (hooks: WalletHooks): Wallets => {
  const wallets = {} as Wallets;

  BLOCKCHAIN_WALLETS.evm.forEach((walletName) => {
    const hook = hooks[walletName];
    if (hook) {
      wallets[walletName] = createEvmWallet(hook);
    }
  });

  BLOCKCHAIN_WALLETS.cardano.forEach((walletName) => {
    const hook = hooks[walletName];
    if (hook && walletName === 'lace') {
      wallets[walletName] = createLaceWallet(hook as any);
    }
  });

  if (hooks.binance) {
    wallets.binance = createBinanceWallet(hooks.binance);
  }
  if (hooks.keplr) {
    wallets.keplr = createKeplrWallet(hooks.keplr);
  }
  if (hooks.xion) {
    wallets.xion = createXionWallet(hooks.xion);
  }
  if (hooks.phantom) {
    wallets.phantom = createPhantomWallet(hooks.phantom);
  }

  return wallets;
};
