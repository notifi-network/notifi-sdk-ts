/**
 * Cardano and Midnight wallet type definitions and interfaces
 *
 * This file defines:
 * 1. CIP-30 standard interfaces for Cardano wallets
 * 2. Midnight network extensions (privacy sidechain)
 * 3. Lace wallet specific types that support both networks
 */

// Basic types
export type HexString = string;
export type Address = HexString;
export type Value = HexString;
export type TransactionHash = HexString;
export type Cbor = HexString;

// Pagination interface for CIP-30
export interface Paginate {
  page: number;
  limit: number;
}

// ============================================================================
// CIP-30 Standard Interfaces (Cardano)
// Reference: https://cips.cardano.org/cip/CIP-30
// ============================================================================

export interface CIP30WalletAPI {
  getNetworkId(): Promise<number>;
  getUsedAddresses(): Promise<Cbor[]>;
  getUnusedAddresses(): Promise<Cbor[]>;
  getChangeAddress(): Promise<Cbor>;
  getRewardAddresses(): Promise<Cbor[]>;
  getBalance?(): Promise<Cbor>;
  getUtxos?(amount?: Cbor, paginate?: Paginate): Promise<Cbor[] | null>;

  signTx?(tx: Cbor, partialSign?: boolean): Promise<Cbor>;
  signData(
    addr: Address,
    payload: HexString,
  ): Promise<{
    signature: HexString;
    key: HexString;
  }>;
  submitTx?(tx: Cbor): Promise<TransactionHash>;

  experimental?: {
    [key: string]: any;
  };
}

export interface CIP30WalletInfo {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<CIP30WalletAPI>;
  isEnabled(): Promise<boolean>;

  experimental?: {
    [key: string]: any;
  };
}

// ============================================================================
// Midnight Network Extensions
// ============================================================================

export enum MidnightNetworkId {
  TESTNET = 0,
  MAINNET = 1,
  DEVNET = 2,
}

export interface ServiceUriConfig {
  node?: string;
  indexer?: string;
  proofServer?: string;
}

export interface MidnightWalletState {
  address: string;
  balance?: {
    available: number;
    pending: number;
    total: number;
  };
}

export interface MidnightWalletAPI extends CIP30WalletAPI {
  state(): Promise<MidnightWalletState>;
  getNetworkId(): Promise<MidnightNetworkId>;
}

export interface MidnightWalletInfo extends CIP30WalletInfo {
  enable(): Promise<MidnightWalletAPI>;
  serviceUriConfig(): Promise<ServiceUriConfig>;
}

// ============================================================================
// Window Provider Interfaces
// ============================================================================

export interface CardanoProvider {
  lace?: CIP30WalletInfo;
  eternl?: CIP30WalletInfo;
  [walletName: string]: CIP30WalletInfo | any;
}

export interface MidnightProvider {
  mnLace?: MidnightWalletInfo;
  [walletName: string]: MidnightWalletInfo | undefined;
}

declare global {
  interface Window {
    cardano?: CardanoProvider;
    midnight?: MidnightProvider;
  }
}

// ============================================================================
// Lace Wallet Specific Types
// ============================================================================

export type LaceCardanoProvider = CIP30WalletInfo;
export type LaceMidnightProvider = MidnightWalletInfo;
export type LaceProvider = CIP30WalletInfo | MidnightWalletInfo;

// @deprecated Use LaceCardanoProvider or LaceMidnightProvider instead
export type MidnightWalletInfo_DEPRECATED = MidnightWalletInfo;

// Address format utilities for Midnight
export interface MidnightAddressComponents {
  coinPublicKey: string; // 32 bytes, base16-encoded
  encryptionPublicKey: string; // 59 bytes, ledger-serialized
}

// Parse Midnight shielded address internal format (coinPublicKey|encryptionPublicKey)
// Note: This is the internal format, actual addresses use bech32m encoding
export const parseMidnightShieldedAddress = (
  internalAddress: string,
): MidnightAddressComponents | null => {
  try {
    const parts = internalAddress.split('|');
    if (parts.length !== 2) {
      return null;
    }
    return {
      coinPublicKey: parts[0], // base16-encoded
      encryptionPublicKey: parts[1], // base16-serialized
    };
  } catch {
    return null;
  }
};

// Format Midnight address components into internal format
export const formatMidnightShieldedAddress = (
  components: MidnightAddressComponents,
): string => {
  return `${components.coinPublicKey}|${components.encryptionPublicKey}`;
};

// Address types supported by Midnight
export enum MidnightAddressType {
  UNSHIELDED = 'addr', // mn_addr (SHA256 of unshielded token public key)
  SHIELDED = 'shield-addr', // mn_shield-addr (bech32m encoded shielded address)
  DUST = 'dust-addr', // mn_dust-addr (dust address, currently undefined)
}

// Website links for wallet installation
export const LACE_WALLET_WEBSITE =
  'https://docs.midnight.network/relnotes/lace';
