import { Types } from 'notifi-graphql/dist';

// If payload type undefined, fallback to default CommunityManagerJsonPayload
export interface FusionMessage<T extends object = CommunityManagerJsonPayload> {
  eventTypeId: string;
  variablesJson: VariablesJsonPayload<T>;
  specificWallets?: ReadonlyArray<
    Readonly<{
      walletPublicKey: string;
      walletBlockchain: Types.WalletBlockchain;
    }>
  >;
}

export type VariablesJsonPayload<T extends object> =
  T extends CommunityManagerJsonPayload ? CommunityManagerJsonPayload : object;

export type CommunityManagerJsonPayload = { Platform: TargetVariables } & {
  [key in OptionalTargetType]?: TargetVariables;
};

export type OptionalTargetType = 'Sms' | 'Telegram' | 'Discord' | 'Email';

/**
 * @param message - only plain text is supported.
 * @param message__markdown - markdown string here will be converted to html.
 */
export type TargetVariables = {
  subject?: string;
  message?: string;
  message__markdown?: string;
  [key: string]: string | undefined;
};
