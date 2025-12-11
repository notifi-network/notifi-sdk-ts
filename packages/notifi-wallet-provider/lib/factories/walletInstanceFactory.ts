import { Wallets } from '../types';
import { BLOCKCHAIN_WALLETS } from '../utils/walletConfigs';
import { createWalletHooks } from './hookCreators';
import {
  createBinanceWallet,
  createEternlWallet,
  createEvmWallet,
  createKeplrWallet,
  createLaceWallet,
  createNufiWallet,
  createOkxCardanoWallet,
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
    if (walletName === 'lace') {
      const hook = hooks.lace;
      if (hook) {
        wallets.lace = createLaceWallet(hook);
      }
    }
    if (walletName === 'eternl') {
      const hook = hooks.eternl;
      if (hook) {
        wallets.eternl = createEternlWallet(hook);
      }
    }
    if (walletName === 'nufi') {
      const hook = hooks.nufi;
      if (hook) {
        wallets.nufi = createNufiWallet(hook);
      }
    }
    if (walletName === 'okx-cardano') {
      const hook = hooks['okx-cardano'];
      if (hook) {
        wallets['okx-cardano'] = createOkxCardanoWallet(hook);
      }
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
