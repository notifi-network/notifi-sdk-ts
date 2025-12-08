import { BlockchainType } from 'notifi-graphql/lib/gql/generated';

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
  'BOTANIX',
  'BOB',
  'MONAD',
  'BASE',
  'BLAST',
  'CELO',
  'MANTLE',
  'SCROLL',
  'LINEA',
  'MANTA',
  'BERACHAIN',
  'HYPEREVM',
  'UNICHAIN',
  'OPTIMISM',
  'THE_ROOT_NETWORK',
  'SEI',
  'SONIC',
  'INK',
  'SWELLCHAIN',
  'HEMI',
  'CORE_BLOCKCHAIN_MAINNET',
  'GOAT_NETWORK',
  'NIBURU_CATACLYSM1',
  'ROME',
  'ZKSYNC',
] as const;

export const CARDANO_BLOCKCHAINS = ['CARDANO'] as const;

export const APTOS_BLOCKCHAINS = ['APTOS', 'MOVEMENT'] as const;

export const SOLANA_BLOCKCHAINS = ['SOLANA'] as const;

export const SUI_BLOCKCHAINS = ['SUI'] as const;

export const BTC_BLOCKCHAINS = ['BITCOIN', 'ARCH'] as const;

// These are chains which we are no longer actively maintaining

export const UNMAINTAINED_BLOCKCHAINS = ['ACALA', 'EVMOS', 'ABSTRACT'] as const;

// All blockchains supported by Notifi - this is used mainly for sanity checking below
const _ALL_BLOCKCHAINS = [
  ...COSMOS_BLOCKCHAINS,
  ...EVM_BLOCKCHAINS,
  ...CARDANO_BLOCKCHAINS,
  ...APTOS_BLOCKCHAINS,
  ...BTC_BLOCKCHAINS,
  ...SOLANA_BLOCKCHAINS,
  ...SUI_BLOCKCHAINS,
  ...UNMAINTAINED_BLOCKCHAINS,
  // Les pieces uniques, tres speciales!
  'OFF_CHAIN',
  'NEAR',
  'INJECTIVE',
  'UNSPECIFIED',
] as const;

type Blockchain = (typeof _ALL_BLOCKCHAINS)[number];

export type UnmaintainedBlockchain = (typeof UNMAINTAINED_BLOCKCHAINS)[number];
export function isUnmaintainedBlockchain(
  blockchain: Blockchain,
): blockchain is UnmaintainedBlockchain {
  return UNMAINTAINED_BLOCKCHAINS.includes(
    blockchain as UnmaintainedBlockchain,
  );
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
  return COSMOS_BLOCKCHAINS.includes(blockchain as CosmosBlockchain);
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
  return EVM_BLOCKCHAINS.includes(blockchain as EvmBlockchain);
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
  return APTOS_BLOCKCHAINS.includes(blockchain as AptosBlockchain);
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
  return BTC_BLOCKCHAINS.includes(blockchain as BtcBlockchain);
}
export function isUsingBtcBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: BtcBlockchain }> {
  return isBtcBlockchain(params.walletBlockchain);
}

export type SolanaBlockchain = (typeof SOLANA_BLOCKCHAINS)[number];
export function isSolanaBlockchain(
  blockchain: Blockchain,
): blockchain is SolanaBlockchain {
  return SOLANA_BLOCKCHAINS.includes(blockchain as SolanaBlockchain);
}
export function isUsingSolanaBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: SolanaBlockchain }> {
  return isSolanaBlockchain(params.walletBlockchain);
}

export type SuiBlockchain = (typeof SUI_BLOCKCHAINS)[number];
export function isSuiBlockchain(
  blockchain: Blockchain,
): blockchain is SuiBlockchain {
  return SUI_BLOCKCHAINS.includes(blockchain as SuiBlockchain);
}
export function isUsingSuiBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: SuiBlockchain }> {
  return isSuiBlockchain(params.walletBlockchain);
}

export type CardanoBlockchain = (typeof CARDANO_BLOCKCHAINS)[number];
export function isCardanoBlockchain(
  blockchain: Blockchain,
): blockchain is CardanoBlockchain {
  return CARDANO_BLOCKCHAINS.includes(blockchain as CardanoBlockchain);
}
export function isUsingCardanoBlockchain<
  T extends { walletBlockchain: Blockchain },
>(params: T): params is Extract<T, { walletBlockchain: CardanoBlockchain }> {
  return isCardanoBlockchain(params.walletBlockchain);
}

// IGNORE BELOW HERE, this simpply serves to ensure all blockchains are covered
// This will cause a type error if AllBlockchains differs from WalletBlockchain
type BlockchainTypeCheck = [
  Blockchain extends BlockchainType ? true : false,
  BlockchainType extends Blockchain ? true : false,
] extends [true, true]
  ? true
  : false;

// This line will cause a compile error if the types don't match exactly
const _typeCheck: BlockchainTypeCheck = true;
