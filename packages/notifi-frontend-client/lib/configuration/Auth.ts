import type { Types } from '@notifi-network/notifi-graphql';

import type { CosmosBlockchain, EvmBlockchain } from '../models';

export type AuthParams =
  | BlockchainAuthParamsWithPublicKey
  | BlockchainAuthParamsWithPublicKeyAndAddress
  | BlockchainAuthParamsWithDelegate
  | OidcAuthParams;

/** Keeps internal in purpose. If needed, use Typescript Extract. e.g. Extract<AuthParams, { walletPublicKey: string }> */
type BlockchainAuthParamsWithPublicKey = {
  walletBlockchain: EvmBlockchain | 'SOLANA';
  walletPublicKey: string;
};

/** NOTE: Extract<AuthParams, { delegatedAddress: string }> */
type BlockchainAuthParamsWithDelegate = {
  walletBlockchain: CosmosBlockchain;
  delegatedAddress: string;
  delegatedPublicKey: string;
  delegatorAddress: string;
};

/**  NOTE: Extract<AuthParams, { authenticationKey: string }> */
type BlockchainAuthParamsWithPublicKeyAndAddress = {
  walletBlockchain: Exclude<
    Types.BlockchainType,
    EvmBlockchain | 'SOLANA' | 'OFF_CHAIN' | 'UNSPECIFIED'
  >;
  walletPublicKey: string;
  accountAddress: string;
};

/**  NOTE: Extract<AuthParams, { userAccount: string }> */
type OidcAuthParams = {
  walletBlockchain: 'OFF_CHAIN';
  userAccount: string;
};

/* ⬇ Validators */
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
