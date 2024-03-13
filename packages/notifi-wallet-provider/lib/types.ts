import type { Keplr, StdSignature } from '@keplr-wallet/types';
import { BrowserProvider, Eip1193Provider } from 'ethers';

// TODO: for localStorage (Not yet impl)
export type NotifiWalletStorage = {
  walletName: keyof Wallets;
  walletKeys: Partial<WalletKeys>;
  isConnected: boolean;
};
export type Ethereum = Eip1193Provider & BrowserProvider;
declare global {
  interface Window {
    keplr: Keplr;
    ethereum: Ethereum;
  }
}
export abstract class NotifiWallet {
  abstract isInstalled: boolean;
  abstract walletKeys: Partial<WalletKeys> | null;
  abstract signArbitrary?: KeplrSignMessage | MetamaskSignMessage;
  abstract connect?: () => Promise<void>;
}
export type WalletKeys = {
  bech32: string; // inj address (or other Cosmos chain ) ex. inj1...
  base64: string; // inj address (or other Cosmos chain ) in base64 format
  hex: string; // eth address
};
export type PickKeys<T, K extends keyof T> = Pick<T, K>;
export type MetamaskSignMessage = (
  message: string,
) => Promise<`0x${string}` | undefined>;
export class MetamaskWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: PickKeys<WalletKeys, 'bech32' | 'hex'> | null,
    public signArbitrary: MetamaskSignMessage,
    public connect: () => Promise<void>,
  ) {}
}
export type KeplrSignMessage = (
  message: string | Uint8Array,
) => Promise<StdSignature | undefined>;
export class KeplrWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: PickKeys<WalletKeys, 'bech32' | 'base64'> | null,
    public signArbitrary: KeplrSignMessage,
    public connect: () => Promise<void>,
  ) {}
}
export type Wallets = {
  metamask: MetamaskWallet;
  keplr: KeplrWallet;
};
