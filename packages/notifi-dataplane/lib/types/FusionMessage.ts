import type { Types } from '@notifi-network/notifi-graphql';

export interface FusionMessage {
  eventTypeId: string;
  variablesJson: object;
  idempotencyKey?: string;
  specificWallets?: ReadonlyArray<
    Readonly<{
      walletPublicKey: string;
      walletBlockchain: Types.BlockchainType;
    }>
  >;
}
