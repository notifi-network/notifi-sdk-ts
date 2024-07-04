import type { Keplr, StdSignature } from '@keplr-wallet/types';
import { Connection, Transaction } from '@solana/web3.js';
import { BrowserProvider, Eip1193Provider } from 'ethers';

import { PhantomProvider } from './utils/solana.type';

export type Ethereum = Eip1193Provider & BrowserProvider;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BinanceChain = Ethereum & { requestAccounts: () => any };
declare global {
  interface Window {
    keplr: Keplr;
    BinanceChain: BinanceChain;
    // NOTE: Only support solana for now (for EVM, use EIP1193Provider)
    phantom: { bitcoin: never; ethereum: never; solana: PhantomProvider };
  }
}

/**
 * @param bech32 cosmos hub chains address ex. Injective for inj1...
 * @param base64 base64 formatted address in base64 format
 * @param hex eth hex address starting with 0x
 */
export type WalletKeysBase = {
  bech32: string;
  base58: string;
  base64: string;
  hex: string;
  grantee: string; //TODO: specifically for Xion now, make it generic pattern, checking the format
};

export type MetamaskWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'hex'>;
export type KeplrWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'base64'>;
export type XionWalletKeys = PickKeys<
  WalletKeysBase,
  'bech32' | 'base64' | 'grantee'
>;
export type PhantomWalletKeys = PickKeys<WalletKeysBase, 'base58'>;

export type WalletKeys =
  | MetamaskWalletKeys
  | KeplrWalletKeys
  | XionWalletKeys
  | PhantomWalletKeys;

export abstract class NotifiWallet {
  abstract isInstalled: boolean;
  abstract walletKeys: WalletKeys | null;
  abstract signArbitrary?:
    | KeplrSignMessage
    | MetamaskSignMessage
    | XionSignMessage
    | PhantomSignMessage;
  abstract connect?: () => Promise<Partial<WalletKeysBase> | null>;
  abstract disconnect?: () => void;
  abstract websiteURL: string;
}

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
    public websiteURL: string,
  ) {}
}
export class CoinbaseWallet extends MetamaskWallet {}
export class RabbyWallet extends MetamaskWallet {}
export class ZerionWallet extends MetamaskWallet {}
export class OKXWallet extends MetamaskWallet {}
export class RainbowWallet extends MetamaskWallet {}
export class BinanceWallet extends MetamaskWallet {}
export class WalletConnectWallet extends MetamaskWallet {}

export type KeplrSignMessage = (
  message: string | Uint8Array,
) => Promise<StdSignature | undefined>;

export type XionSignMessage = (message: string) => Promise<string | undefined>;

export class KeplrWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: KeplrWalletKeys | null,
    public signArbitrary: KeplrSignMessage,
    public connect: () => Promise<KeplrWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}
export class XionWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: XionWalletKeys | null,
    public signArbitrary: XionSignMessage,
    public connect: () => Promise<null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}

export type PhantomSignMessage = (message: Uint8Array) => Promise<Uint8Array>;
export class PhantomWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: PhantomWalletKeys | null,
    public signArbitrary: PhantomSignMessage,
    public connect: () => Promise<PhantomWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
    public signTransaction: (
      transaction: Transaction,
      connection: Connection,
    ) => Promise<string>,
  ) {}
}

export type Wallets = {
  metamask: MetamaskWallet;
  keplr: KeplrWallet;
  coinbase: CoinbaseWallet;
  rabby: RabbyWallet;
  rainbow: RainbowWallet;
  zerion: ZerionWallet;
  okx: OKXWallet;
  binance: BinanceWallet;
  walletconnect: WalletConnectWallet;
  xion: XionWallet;
  phantom: PhantomWallet;
};
