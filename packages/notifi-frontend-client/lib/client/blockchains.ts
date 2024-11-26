import { WalletBlockchain } from 'notifi-graphql/lib/gql/generated';

// Grouping  of blockchains supported by Notifi
export const COSMOS_BLOCKCHAINS = [
  'COSMOS',
  'OSMOSIS',
  'NEUTRON',
  'ELYS',
  'ARCHWAY',
  'AXELAR',
  'AGORIC',
  'ORAI',
  'KAVA',
  'CELESTIA',
  'NIBIRU',
  'DYMENSION',
  'PERSISTENCE',
  'DYDX',
  'XION',
] as const;

export const EVM_BLOCKCHAINS = [
  'ETHEREUM',
  'POLYGON',
  'ARBITRUM',
  'AVALANCHE',
  'BINANCE',
  'THE_ROOT_NETWORK',
  'MONAD',
  'BASE',
  'BLAST',
  'CELO',
  'MANTLE',
  'SCROLL',
  'LINEA',
  'MANTA',
  'BERACHAIN',
  'OPTIMISM',
  'THE_ROOT_NETWORK',
  'INJECTIVE',
  'ZKSYNC',
] as const;

export const APTOS_BLOCKCHAINS = ['APTOS', 'MOVEMENT'] as const;

export const BTC_BLOCKCHAINS = ['BITCOIN', 'ARCH'] as const;

// These are chains which we are no longer actively maintaining

export const UNMAINTAINED_BLOCKCHAINS = ['ACALA', 'EVMOS'] as const;

// All blockchains supported by Notifi - this is used mainly for sanity checking below
const ALL_BLOCKCHAINS = [
  ...COSMOS_BLOCKCHAINS,
  ...EVM_BLOCKCHAINS,
  ...APTOS_BLOCKCHAINS,
  ...BTC_BLOCKCHAINS,
  ...UNMAINTAINED_BLOCKCHAINS,
  // Les pieces uniques, tres speciales!
  'OFF_CHAIN',
  'SOLANA',
  'SUI',
  'NEAR',
] as const;

type Blockchain = (typeof ALL_BLOCKCHAINS)[number];

export type UnmaintainedBlockchain = (typeof UNMAINTAINED_BLOCKCHAINS)[number];
export function isUnmaintainedBlockchain(
  blockchain: Blockchain,
): blockchain is UnmaintainedBlockchain {
  return UNMAINTAINED_BLOCKCHAINS.includes(blockchain as any);
}
export function isUsingUnmaintainedBlockchain<
  T extends { walletBlockchain: Blockchain },
>(
  params: T,
): params is Extract<T, { walletBlockchain: UnmaintainedBlockchain }> {
  return isUnmaintainedBlockchain(params.walletBlockchain);
}

export type CosmosBlockchain = (typeof COSMOS_BLOCKCHAINS)[number];
export function isCosmosBlockchain(
  blockchain: Blockchain,
): blockchain is CosmosBlockchain {
  return COSMOS_BLOCKCHAINS.includes(blockchain as any);
}
export function isUsingCosmosBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: CosmosBlockchain }> {
  return isCosmosBlockchain(params.walletBlockchain);
}

export type EvmBlockchain = (typeof EVM_BLOCKCHAINS)[number];
export function isEvmBlockchain(
  blockchain: Blockchain,
): blockchain is EvmBlockchain {
  return EVM_BLOCKCHAINS.includes(blockchain as any);
}
export function isUsingEvmBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: EvmBlockchain }> {
  return isEvmBlockchain(params.walletBlockchain);
}

export type AptosBlockchain = (typeof APTOS_BLOCKCHAINS)[number];
export function isAptosBlockchain(
  blockchain: Blockchain,
): blockchain is AptosBlockchain {
  return APTOS_BLOCKCHAINS.includes(blockchain as any);
}
export function isUsingAptosBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: AptosBlockchain }> {
  return isAptosBlockchain(params.walletBlockchain);
}

export type BtcBlockchain = (typeof BTC_BLOCKCHAINS)[number];
export function isBtcBlockchain(
  blockchain: Blockchain,
): blockchain is BtcBlockchain {
  return BTC_BLOCKCHAINS.includes(blockchain as any);
}
export function isUsingBtcBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: BtcBlockchain }> {
  return isBtcBlockchain(params.walletBlockchain);
}

// IGNORE BELOW HERE, this simpply serves to ensure all blockchains are covered
// This will cause a type error if AllBlockchains differs from WalletBlockchain
type BlockchainTypeCheck = [
  Blockchain extends WalletBlockchain ? true : false,
  WalletBlockchain extends Blockchain ? true : false,
] extends [true, true]
  ? true
  : false;

// This line will cause a compile error if the types don't match exactly
const _typeCheck: BlockchainTypeCheck = true;
