import { BrowserProvider, Eip1193Provider } from 'ethers';

export type Ethereum = Eip1193Provider & BrowserProvider;

/**
 * @param bech32 cosmos hub chains address ex. Injective for inj1...
 * @param base64 base64 formatted address in base64 format
 * @param hex eth hex address starting with 0x
 */
export type WalletKeysBase = {
  bech32: string;
  base64: string;
  hex: string;
};

export type LeapWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'base64'>;
export type PhantomWalletKeys = PickKeys<WalletKeysBase, 'bech32' | 'hex'>;

export type WalletKeys = LeapWalletKeys | PhantomWalletKeys;

export abstract class NotifiWallet {
  abstract isInstalled: boolean;
  abstract walletKeys: WalletKeys | null;
  abstract signArbitrary?: LeapSignMessage | PhantomSignMessage;
  abstract connect?: () => Promise<Partial<WalletKeysBase> | null>;
  abstract disconnect?: () => void;
}

export type NotifiWalletStorage = {
  walletName: keyof InjectiveWallets;
  walletKeys: WalletKeys;
};

export type PickKeys<T, K extends keyof T> = Pick<T, K>;

export type LeapSignMessage = (message: string) => Promise<string | void>;
export type PhantomSignMessage = (message: string) => Promise<string | void>;

export class LeapWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: LeapWalletKeys | null,
    public signArbitrary: LeapSignMessage,
    public connect: () => Promise<LeapWalletKeys | null>,
    public disconnect: () => void,
  ) {}
}

export class PhantomWallet implements NotifiWallet {
  constructor(
    public isInstalled: boolean,
    public walletKeys: PhantomWalletKeys | null,
    public signArbitrary: PhantomSignMessage,
    public connect: () => Promise<PhantomWalletKeys | null>,
    public disconnect: () => void,
  ) {}
}
export type InjectiveWallets = {
  leap: LeapWallet;
  phantom: PhantomWallet;
};
