import type { Keplr, StdSignature } from '@keplr-wallet/types';
import { Connection, Transaction } from '@solana/web3.js';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { Config } from 'wagmi';
import { SendTransactionVariables } from 'wagmi/query';

import { CIP30WalletAPI, LaceProvider } from './utils/lace.type';
import { PhantomProvider } from './utils/solana.type';

export type Ethereum = Eip1193Provider & BrowserProvider;
export type BinanceChain = Ethereum & {
  requestAccounts: () => Promise<
    { addresses: { type: string; address: string }[] }[]
  >;
};
declare global {
  interface Window {
    keplr: Keplr;
    BinanceChain: BinanceChain;
    // NOTE: Only support solana for now (for EVM, use EIP1193Provider)
    phantom: { bitcoin: never; ethereum: never; solana: PhantomProvider };
    // NOTE: window.cardano and window.midnight interfaces are declared in lace.type.ts
    // Lace wallet is accessed via window.cardano.lace (primary) or window.midnight.mnLace (fallback)
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
  cbor: string; // CBOR-encoded address (hex string) used by Cardano/Lace
};

export type MetamaskWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'hex'>; // Adoptable to all EVM wallets
export type KeplrWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'base64'>;
export type PhantomWalletKeys = PickKeys<WalletKeysBase, 'base58'>;
export type LaceWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'cbor'>;
export type EternlWalletKeys = LaceWalletKeys;
export type NufiWalletKeys = LaceWalletKeys;
export type OkxCardanoWalletKeys = LaceWalletKeys;
export type YoroiWalletKeys = LaceWalletKeys;
export type CtrlWalletKeys = LaceWalletKeys;

export type WalletKeys =
  | MetamaskWalletKeys
  | KeplrWalletKeys
  | PhantomWalletKeys
  | LaceWalletKeys;

export abstract class NotifiWallet {
  abstract isInstalled: boolean;
  abstract walletKeys: WalletKeys | null;
  abstract signArbitrary?:
    | KeplrSignMessage
    | MetamaskSignMessage
    | PhantomSignMessage
    | LaceSignMessage;
  // TODO: Impl sendTransaction for Keplr
  abstract sendTransaction?: EvmSendTransaction;
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
) => Promise<`0x${string}` | undefined>; // Adoptable to all EVM wallets

export type EvmSendTransaction = (
  transaction:
    | object // Injected Wallet specific: Raw payload (normal object)
    | SendTransactionVariables<Config, number>, //  Wagmi wrapped payload
) => Promise<`0x${string}` | undefined>;

export class EvmWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: MetamaskWalletKeys | null,
    public signArbitrary: MetamaskSignMessage,
    public connect: () => Promise<MetamaskWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
    public sendTransaction: EvmSendTransaction,
  ) {}
}

export class BinanceWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: MetamaskWalletKeys | null,
    public signArbitrary: MetamaskSignMessage,
    public connect: () => Promise<MetamaskWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
    public sendTransaction: EvmSendTransaction,
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
    public websiteURL: string,
  ) {}
}

export type PhantomSignMessage = (message: Uint8Array) => Promise<Uint8Array>;
export type LaceSignMessage = (
  message: string,
) => Promise<ReturnType<CIP30WalletAPI['signData']> | undefined>;

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
    public signHardwareTransaction: (
      transaction: Transaction,
    ) => Promise<Transaction>,
  ) {}
}

export class LaceWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: LaceWalletKeys | null,
    public signArbitrary: LaceSignMessage,
    public connect: () => Promise<LaceWalletKeys | null>,
    public disconnect: () => void,
    public websiteURL: string,
  ) {}
}

export type Wallets = {
  metamask: EvmWallet;
  keplr: KeplrWallet;
  coinbase: EvmWallet;
  rabby: EvmWallet;
  rainbow: EvmWallet;
  zerion: EvmWallet;
  okx: EvmWallet;
  binance: BinanceWallet;
  walletconnect: EvmWallet;
  phantom: PhantomWallet;
  lace: LaceWallet;
  eternl: LaceWallet;
  nufi: LaceWallet;
  'okx-cardano': LaceWallet;
  yoroi: LaceWallet;
  ctrl: LaceWallet;
};
