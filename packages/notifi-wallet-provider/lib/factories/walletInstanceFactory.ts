import { Wallets } from '../types';
import { BLOCKCHAIN_WALLETS } from '../utils/walletConfigs';
import { createWalletHooks } from './hookCreators';
import {
  createBinanceWallet,
  createEvmWallet,
  createKeplrWallet,
  createMidnightWallet,
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
  if (hooks.midnight) {
    wallets.midnight = createMidnightWallet(hooks.midnight);
  }

  return wallets;
};
