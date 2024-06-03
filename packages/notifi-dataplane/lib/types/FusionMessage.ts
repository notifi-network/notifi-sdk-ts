import { Types } from 'notifi-graphql/dist';

export interface FusionMessage {
  eventTypeId: string;
  variablesJson: object;
  idempotencyKey?: string;
  specificWallets?: ReadonlyArray<
    Readonly<{
      walletPublicKey: string;
      walletBlockchain: Types.WalletBlockchain;
    }>
  >;
}
