import { Types } from 'notifi-graphql/dist';

export interface FusionMessage {
  eventTypeId: string;
  variablesJson: object | VariablesJsonPayload;
  specificWallets?: ReadonlyArray<
    Readonly<{
      walletPublicKey: string;
      walletBlockchain: Types.WalletBlockchain;
    }>
  >;
}

export type OptionalTargetType = 'Sms' | 'Telegram' | 'Discord' | 'Email';

export type VariablesJsonPayload = { Platform: TargetVariables } & {
  [key in OptionalTargetType]?: TargetVariables;
};

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
