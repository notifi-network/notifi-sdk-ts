import { WalletBlockchain } from "@notifi-network/notifi-core";

const UNSUPPORTED_BLOCKCHAINS = ['XION'] as const;

export type UnsupportedBlockchain = typeof UNSUPPORTED_BLOCKCHAINS[number];

export function assertIsSupportedBlockchain(blockchain: WalletBlockchain): asserts blockchain is Exclude<WalletBlockchain, UnsupportedBlockchain> {
  const isUnsupported = (UNSUPPORTED_BLOCKCHAINS).includes(blockchain as any);
  if (isUnsupported) {
    throw new Error(`Unsupported blockchain: ${blockchain}`);
  }
}
