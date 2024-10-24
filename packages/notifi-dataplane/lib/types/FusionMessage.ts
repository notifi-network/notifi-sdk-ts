import { Types } from 'notifi-graphql/dist';

// If payload type undefined, fallback to object by default
export interface FusionMessage<T extends object = object> {
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

export type CommunityManagerJsonPayload = {
  campaignId: string;
  Platform: TargetVariables;
} & {
  [key in OptionalTargetType]?: TargetVariables;
};

export type OptionalTargetType = 'Sms' | 'Telegram' | 'Discord' | 'Email';

/**
 * @param message - only plain text is supported.
 * @param message__markdown - markdown string here will be converted to html.
 * @param sourceMessage - usually to be html format source.
 */
export type TargetVariables = {
  subject?: string;
  message?: string;
  message__markdown?: string;
  sourceMessage?: string;
  [key: string]: string | undefined;
};
