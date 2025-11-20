/**
 * Midnight wallet type definitions and interfaces
 * Based on Midnight wallet specification and CIP-30 standards
 */

// Basic Midnight types
export type HexString = string;
export type Address = HexString;
export type Value = HexString;
export type TransactionHash = HexString;
export type Cbor = HexString;

// Network ID enum for Midnight
export enum MidnightNetworkId {
  TESTNET = 0,
  MAINNET = 1,
  DEVNET = 2,
}

// Service configuration interface
export interface ServiceUriConfig {
  node?: string;
  indexer?: string;
  proofServer?: string;
}

// Wallet state interface
export interface MidnightWalletState {
  address: string;
  balance?: {
    available: number;
    pending: number;
    total: number;
  };
}

// Core Midnight Wallet API (after enabling)
export interface MidnightWalletAPI {
  // Core state methods
  state(): Promise<MidnightWalletState>;

  // Network information
  getNetworkId?(): Promise<MidnightNetworkId>;

  // Transaction methods
  signData?(
    addr: Address,
    payload: HexString,
  ): Promise<{
    signature: HexString;
    key: HexString;
  }>;

  // Optional experimental methods
  experimental?: {
    [key: string]: any;
  };
}

// Midnight Wallet Info (before enabling)
export interface MidnightWalletInfo {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<MidnightWalletAPI>;
  isEnabled(): Promise<boolean>;
  serviceUriConfig(): Promise<ServiceUriConfig>;

  // Optional experimental features
  experimental?: {
    [key: string]: any;
  };
}

// Main Midnight interface injected into window
export interface Midnight {
  mnLace?: MidnightWalletInfo;
  [walletName: string]: MidnightWalletInfo | undefined;
}

// Extend the global Window interface
declare global {
  interface Window {
    midnight?: Midnight;
  }
}

// Midnight Provider type for hook usage
export type MidnightProvider = MidnightWalletInfo;

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
export const MIDNIGHT_WALLET_WEBSITE =
  'https://docs.midnight.network/relnotes/lace';
