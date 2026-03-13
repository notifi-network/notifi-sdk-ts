/**
 * Cardano wallet type definitions and interfaces
 *
 * This file defines:
 * 1. CIP-30 standard interfaces for Cardano wallets
 * 2. Lace wallet specific types
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
// Window Provider Interfaces
// ============================================================================

export interface CardanoProvider {
  lace?: CIP30WalletInfo;
  eternl?: CIP30WalletInfo;
  nufi?: CIP30WalletInfo;
  okxwallet?: CIP30WalletInfo;
  yoroi?: CIP30WalletInfo;
  ctrl?: CIP30WalletInfo;
  [walletName: string]: CIP30WalletInfo | any;
}

declare global {
  interface Window {
    cardano?: CardanoProvider;
  }
}

// ============================================================================
// Lace Wallet Specific Types
// ============================================================================

export type LaceCardanoProvider = CIP30WalletInfo;
