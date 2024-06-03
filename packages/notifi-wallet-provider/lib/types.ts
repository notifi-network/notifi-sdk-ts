import type { Keplr, StdSignature } from '@keplr-wallet/types';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { BrowserProvider, Eip1193Provider } from 'ethers';

export type Ethereum = Eip1193Provider & BrowserProvider;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BinanceChain = Ethereum & { requestAccounts: () => any };
declare global {
  interface Window {
    keplr: Keplr;
    phantom: PhantomWalletAdapter;
    backpack: unknown;
    leap?: unknown;
    solflare: unknown;
    BinanceChain: BinanceChain;
  }
}

/**
 * @param bech32 cosmos hub chains address ex. Injective for inj1...
 * @param base64 base64 formatted address in base64 format
 * @param hex eth hex address starting with 0x
 */
export type WalletKeysBase = {
  bech32: string;
  base64: string;
  base58: string;
  hex: string;
};

export type MetamaskWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'hex'>;
export type KeplrWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'base64'>;
export type LeapWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'base64'>;
export type PhantomWalletKeys = PickKeys<
  WalletKeysBase,
  'bech32' | 'base58' | 'hex'
>;
export type BackpackWalletKeys = PickKeys<
  WalletKeysBase,
  'bech32' | 'base58' | 'hex'
>;

export type SolflareWalletKeys = PickKeys<
  WalletKeysBase,
  'bech32' | 'base58' | 'hex'
>;
export type SuiWalletKeys = PickKeys<WalletKeysBase, 'hex'>;
// export type EthosWalletKeys = PickKeys<WalletKeysBase, 'hex'>;

export type WalletKeys =
  | MetamaskWalletKeys
  | KeplrWalletKeys
  | LeapWalletKeys
  | PhantomWalletKeys
  | BackpackWallet
  | SuiWalletKeys;

export abstract class NotifiWallet {
  abstract isInstalled: boolean;
  abstract walletKeys: WalletKeys | null;
  abstract signArbitrary?:
    | KeplrSignMessage
    | MetamaskSignMessage
    | LeapSignMessage
    | PhantomSignMessage
    | SuiSignMessage;
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

export type LeapSignMessage = (
  message: string | Uint8Array,
) => Promise<StdSignature | void>;

export type PhantomSignMessage = (message: string) => Promise<string | void>;
export type BackpackSignMessage = (message: string) => Promise<string | void>;
export type SolflareSignMessage = (message: string) => Promise<string | void>;
export type SuiSignMessage = (message: string) => Promise<string | void>;
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

export class LeapWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: LeapWalletKeys | null,
    public signArbitrary: LeapSignMessage,
    public connect: () => Promise<LeapWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}

export class PhantomWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: PhantomWalletKeys | null,
    public signArbitrary: PhantomSignMessage,
    public connect: () => Promise<PhantomWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}

export class BackpackWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: BackpackWalletKeys | null,
    public signArbitrary: BackpackSignMessage,
    public connect: () => Promise<BackpackWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}

export class SolflareWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: SolflareWalletKeys | null,
    public signArbitrary: SolflareSignMessage,
    public connect: () => Promise<SolflareWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}

export class SuiWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: SuiWalletKeys | null,
    public signArbitrary: SuiSignMessage,
    public connect: () => Promise<SuiWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}
export class EthosWallet extends SuiWallet {}
export class MartianWallet extends SuiWallet {}

export type Wallets = {
  metamask: MetamaskWallet;
  keplr: KeplrWallet;
  leap: LeapWallet;
  phantom: PhantomWallet;
  backpack: BackpackWallet;
  solflare: SolflareWallet;
  coinbase: CoinbaseWallet;
  rabby: RabbyWallet;
  rainbow: RainbowWallet;
  zerion: ZerionWallet;
  okx: OKXWallet;
  binance: BinanceWallet;
  walletconnect: WalletConnectWallet;
  suiwallet: SuiWallet;
  ethoswallet: EthosWallet;
  martianwallet: MartianWallet;
};
