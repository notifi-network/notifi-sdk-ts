import { WalletBlockchain } from "@notifi-network/notifi-core";

export interface FusionMessage {
  eventTypeId: string,
  variablesJson: any,
  specificWallets?: ReadonlyArray<
    Readonly<{
      walletPublicKey: string;
      walletBlockchain: WalletBlockchain;
    }>
  >,
}