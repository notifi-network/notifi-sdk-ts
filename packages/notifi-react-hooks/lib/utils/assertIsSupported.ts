const UNSUPPORTED_BLOCKCHAINS = ['XION'] as const;

export type UnsupportedBlockchain = typeof UNSUPPORTED_BLOCKCHAINS[number];

export function assertIsSupportedBlockchain<T>(blockchain: T): asserts blockchain is Exclude<T, UnsupportedBlockchain> {
  const isUnsupported = (UNSUPPORTED_BLOCKCHAINS).includes(blockchain as any);
  if (isUnsupported) {
    throw new Error(`Unsupported blockchain: ${blockchain}`);
  }
}
