import type { Types } from '@notifi-network/notifi-graphql';

import type { CosmosBlockchain, EvmBlockchain } from '../models';
import * as blockchain from '../models/Blockchain';

/**
 * =============================================================================
 * Why we need both `UserParams` and `AuthParams`
 * =============================================================================
 *
 * At first glance, `UserParams` and `AuthParams` may look redundant—
 * both describe information about a user's blockchain wallet.
 * However, they are defined from **two fundamentally different perspectives**:
 *
 * -----------------------------------------------------------------------------
 * 1. `UserParams`: Grouped by `walletBlockchain` (chain-based classification)
 * -----------------------------------------------------------------------------
 * - Each supported blockchain (e.g., SOLANA, EVM, APTOS, COSMOS, etc.)
 *   gets its own specific structure under `UserParams`.
 * - This allows us to define *chain-specific* behaviors and requirements,
 *   even when some fields may be shared.
 * - Example:
 *     - `SolanaUserParams` and `EvmUserParams` both contain `walletPublicKey`
 *     - `CosmosUserParams` has two *distinct shapes* for the same chain
 * - So even for the same `walletBlockchain`, the structure may vary!
 *
 * -----------------------------------------------------------------------------
 * 2. `AuthParams`: Grouped by data structure (field-based classification)
 * -----------------------------------------------------------------------------
 * - Represents authentication input grouped by the *shape of the object*,
 *   not by which chain it's for.
 * - This is useful for extracting behavior based on *what data is present*,
 *   not which blockchain it belongs to.
 * - Example:
 *     - All objects with `walletPublicKey + accountAddress` fall under
 *       `BlockchainAuthParamsWithPublicKeyAndAddress`, regardless of chain.
 *     - Off-chain login (`userAccount`) always maps to `OidcAuthParams`
 *
 * -----------------------------------------------------------------------------
 * Summary:
 * -----------------------------------------------------------------------------
 * - `UserParams` answers: **"What does a user look like on this chain?"**
 * - `AuthParams` answers: **"What kind of auth strategy does this object represent?"**
 *
 * The need to handle:
 *   - multiple data shapes per chain (e.g., Cosmos),
 *   - and common shapes across chains,
 * makes it impossible to use just one classification axis.
 * Thus, **both type groups are necessary** for type safety, flexibility, and clarity.
 */

/* ============================================================================
 * AuthParams Definitions - for _authenticate, which aims to be deprecated
 * ========================================================================== */

/** Keeps internal in purpose. If needed, use Typescript Extract.
 *  e.g. Extract<AuthParams, { walletPublicKey: string }> */
export type BlockchainAuthParamsWithPublicKey = {
  walletBlockchain: EvmBlockchain | 'SOLANA';
  walletPublicKey: string;
};

/** NOTE: Extract<AuthParams, { delegatedAddress: string }> */
export type BlockchainAuthParamsWithDelegate = {
  walletBlockchain: CosmosBlockchain;
  delegatedAddress: string;
  delegatedPublicKey: string;
  delegatorAddress: string;
};

/** NOTE: Extract<AuthParams, { authenticationKey: string }> */
export type BlockchainAuthParamsWithPublicKeyAndAddress = {
  walletBlockchain: Exclude<
    Types.BlockchainType,
    EvmBlockchain | 'SOLANA' | 'OFF_CHAIN' | 'UNSPECIFIED'
  >;
  walletPublicKey: string;
  accountAddress: string;
};

/** NOTE: Extract<AuthParams, { userAccount: string }> */
export type OidcAuthParams = {
  walletBlockchain: 'OFF_CHAIN';
  userAccount: string;
};

export type AuthParams =
  | BlockchainAuthParamsWithPublicKey
  | BlockchainAuthParamsWithPublicKeyAndAddress
  | BlockchainAuthParamsWithDelegate
  | OidcAuthParams;

/* ============================================================================
 * UserParams Definitions - for instantiateFrontendClient, which allows inputting chain-specific user params
 * ========================================================================== */

export type SolanaUserParams = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
  hardwareLoginPlugin?: {
    /**
     * @deprecated Use signTransaction() instead. We no longer have to send a txn, and instead simply rely on the signed TX as we can verify this on Notifi Services.
     */
    sendMessage?: (message: string) => Promise<string>;
    signTransaction: (message: string) => Promise<string>;
  };
}>;

export type EvmUserParams = Readonly<{
  walletBlockchain: EvmBlockchain;
  walletPublicKey: string;
}>;

export type AptosUserParams = Readonly<{
  walletBlockchain: blockchain.AptosBlockchain;
  accountAddress: string;
  walletPublicKey: string;
}>;

export type BtcUserParams = Readonly<{
  walletBlockchain: blockchain.BtcBlockchain;
  accountAddress: string;
  walletPublicKey: string;
}>;

export type InjectiveUserParams = Readonly<{
  walletBlockchain: 'INJECTIVE';
  accountAddress: string;
  walletPublicKey: string;
}>;

export type CosmosUserParams =
  | Readonly<{
    walletBlockchain: blockchain.CosmosBlockchain;
    accountAddress: string;
    walletPublicKey: string;
  }>
  | Readonly<{
    walletBlockchain: blockchain.CosmosBlockchain;
    walletPublicKey: string;
    signingAddress: string;
    signingPubkey: string;
  }>;

export type UnmaintainedUserParams = Readonly<{
  walletBlockchain: blockchain.UnmaintainedBlockchain;
  accountAddress: string;
  walletPublicKey: string;
}>;

export type NearUserParams = Readonly<{
  walletBlockchain: 'NEAR';
  accountAddress: string;
  walletPublicKey: string;
}>;

export type CardanoUserParams = Readonly<{
  walletBlockchain: 'CARDANO';
  walletPublicKey: string;
}>;

export type SuiUserParams = Readonly<{
  walletBlockchain: 'SUI';
  accountAddress: string;
  walletPublicKey: string;
}>;

export type OffChainUserParams = Readonly<{
  walletBlockchain: 'OFF_CHAIN';
  userAccount: string;
}>;

export type UserParams =
  | SolanaUserParams
  | EvmUserParams
  | AptosUserParams
  | NearUserParams
  | CardanoUserParams
  | SuiUserParams
  | CosmosUserParams
  | OffChainUserParams
  | UnmaintainedUserParams
  | BtcUserParams
  | InjectiveUserParams;

/* ============================================================================
 * Validators
 * ========================================================================== */

export const checkIsConfigWithPublicKeyAndAddress = <T extends AuthParams>(
  config: T,
): config is Extract<T, BlockchainAuthParamsWithPublicKeyAndAddress> => {
  return 'accountAddress' in config;
};

export const checkIsConfigWithPublicKey = <T extends AuthParams>(
  config: T,
): config is Extract<T, BlockchainAuthParamsWithPublicKey> => {
  return 'walletPublicKey' in config && !('accountAddress' in config);
};

export const checkIsConfigWithDelegate = <T extends AuthParams>(
  config: T,
): config is Extract<T, BlockchainAuthParamsWithDelegate> => {
  return 'delegatedAddress' in config;
};

export const checkIsConfigWithOidc = <T extends AuthParams>(
  config: T,
): config is Extract<T, OidcAuthParams> => {
  return config.walletBlockchain === 'OFF_CHAIN';
};
