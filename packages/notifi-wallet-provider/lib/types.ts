import type { Keplr, StdSignature } from '@keplr-wallet/types';
import { BrowserProvider, Eip1193Provider } from 'ethers';

export type Ethereum = Eip1193Provider & BrowserProvider;
declare global {
  interface Window {
    keplr: Keplr;
    ethereum: Ethereum;
  }
}

export type WalletKeysBase = {
  bech32: string; // inj address (or other Cosmos chain ) ex. inj1...
  base64: string; // inj address (or other Cosmos chain ) in base64 format
  hex: string; // eth address
};
export type MetamaskWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'hex'>;
export type KeplrWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'base64'>;

// TODO: refactor a new type WalletKeys
export type WalletKeys = MetamaskWalletKeys | KeplrWalletKeys;

export abstract class NotifiWallet {
  abstract isInstalled: boolean;
  abstract walletKeys: WalletKeys | null;
  abstract signArbitrary?: KeplrSignMessage | MetamaskSignMessage;
  abstract connect?: () => Promise<Partial<WalletKeysBase> | null>;
  abstract disconnect?: () => void;
}

// TODO: for localStorage (Not yet impl)
export type NotifiWalletStorage = {
  walletName: keyof Wallets;
  walletKeys: WalletKeys;
};

export type PickKeys<T, K extends keyof T> = Pick<T, K>;
export type MetamaskSignMessage = (
  message: string,
) => Promise<`0x${string}` | undefined>;

export class MetamaskWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: MetamaskWalletKeys | null,
    public signArbitrary: MetamaskSignMessage,
    public connect: () => Promise<MetamaskWalletKeys | null>,
    public disconnect: () => void,
  ) {}
}
export type KeplrSignMessage = (
  message: string | Uint8Array,
) => Promise<StdSignature | undefined>;

export class KeplrWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: KeplrWalletKeys | null,
    public signArbitrary: KeplrSignMessage,
    public connect: () => Promise<KeplrWalletKeys | null>,
    public disconnect: () => void,
  ) {}
}
export type Wallets = {
  metamask: MetamaskWallet;
  keplr: KeplrWallet;
};
