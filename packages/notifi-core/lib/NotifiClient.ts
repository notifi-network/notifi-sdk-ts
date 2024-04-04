import { Types } from '@notifi-network/notifi-graphql';

import {
  Alert,
  ClientConfiguration,
  ConnectedWallet,
  NotificationHistory,
  SourceGroup,
  TargetGroup,
  TenantConfig,
  User,
  UserTopic,
} from './models';
import {
  ConnectWalletInput,
  CreateSourceInput,
  CreateWebhookTargetInput,
  FindTenantConfigInput,
  GetFusionNotificationHistoryInput,
  GetNotificationHistoryInput,
} from './operations';

export type ClientData = Readonly<{
  alerts: ReadonlyArray<Alert>;
  connectedWallets: ReadonlyArray<Types.ConnectedWalletFragmentFragment>;
  emailTargets: ReadonlyArray<Types.EmailTargetFragmentFragment>;
  filters: ReadonlyArray<Types.FilterFragmentFragment>;
  smsTargets: ReadonlyArray<Types.SmsTargetFragmentFragment>;
  sources: ReadonlyArray<Types.SourceFragmentFragment>;
  sourceGroups: ReadonlyArray<Types.SourceGroupFragmentFragment>;
  targetGroups: ReadonlyArray<Types.TargetGroupFragmentFragment>;
  telegramTargets: ReadonlyArray<Types.TelegramTargetFragmentFragment>;
  discordTargets: ReadonlyArray<Types.DiscordTargetFragmentFragment>;
}>;

export type AlertFrequency =
  | 'ALWAYS'
  | 'SINGLE'
  | 'QUARTER_HOUR'
  | 'HOURLY'
  | 'DAILY'
  | 'THREE_MINUTES';

export type ThresholdDirection = 'above' | 'below';

export type ValueItemConfig = Readonly<{
  key: string;
  op: 'lt' | 'lte' | 'eq' | 'gt' | 'gte';
  value: string;
}>;

export type FilterOptions = Partial<{
  alertFrequency: AlertFrequency;
  directMessageType: string;
  threshold: number;
  delayProcessingUntil: string;
  thresholdDirection: ThresholdDirection;
  values: Readonly<
    | { and: ReadonlyArray<ValueItemConfig> }
    | { or: ReadonlyArray<ValueItemConfig> }
  >;
  tradingPair: string;
}>;

/**
 * Object containing information to continue the login process
 *
 * @property nonce - String value to place in transaction logs
 */
export type BeginLoginViaTransactionResult = Readonly<{
  logValue: string;
}>;

/**
 * Object containing information to complete the login process
 *
 * @property transactionSignature - Signature of the transaction that contains the log message
 */
export type CompleteLoginViaTransactionInput = Readonly<{
  transactionSignature: string;
}>;

/**
 * Completed authentication response
 *
 */
export type CompleteLoginViaTransactionResult = Readonly<User>;

/**
 * Input param for updating an Alert
 *
 * @remarks
 * This describes the Alert to be updated based on id, emailAddress, phoneNumber and/or telegramId
 *
 * @property alertId - The alert to modify
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://notifi-network.github.io/notifi-sdk-ts/} for more information on creating Alerts
 */
export type ClientUpdateAlertInput = Readonly<{
  alertId: string;
  emailAddress: string | undefined;
  phoneNumber: string | undefined;
  telegramId: string | undefined;
  webhook?: ClientCreateWebhookParams;
  includeDiscord: boolean;
}>;

/**
 * Input param for creating an Alert
 *
 * @remarks
 * This describes the Alert to be created based on name, emailAddress, phoneNumber and/or telegramId
 *
 * @property name - Friendly name (must be unique)
 * @property sourceGroupId - The SourceGroup to associate
 * @property filterId - The Filter to associate
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * @property discordId - The the discord id to be used
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://notifi-network.github.io/notifi-sdk-ts/} for more information on creating Alerts
 */
export type ClientCreateAlertInput = Readonly<{
  name: string;
  sourceId: string;
  filterId: string;
  filterOptions?: Readonly<FilterOptions>;
  emailAddress: string | undefined;
  phoneNumber: string | undefined;
  telegramId: string | undefined;
  groupName?: string;
  targetGroupName?: string;
  webhook?: ClientCreateWebhookParams;
  sourceIds?: ReadonlyArray<string>;
  sourceGroupName?: string;
  includeDiscord: boolean;
}>;

export type ClientCreateWebhookParams = Omit<CreateWebhookTargetInput, 'name'>;

/**
 * Input param for creating a new Metaplex Auction Source
 *
 * @property auctionAddressBase58 - Metaplex auction address in base58
 * @property auctionWebUrl - Web URL where auction can be found
 *
 *
 * See [Alert Creation Guide]{@link https://notifi-network.github.io/notifi-sdk-ts/} for more information on creating Alerts
 */
export type ClientCreateMetaplexAuctionSourceInput = Readonly<{
  auctionAddressBase58: string;
  auctionWebUrl: string;
}>;

/**
 * Input param for creating a new Bonfida Auction Source
 *
 * @property auctionAddressBase58 - Bonfida auction address in base58
 * @property auctionName - Name of the auction
 *
 *
 * See [Alert Creation Guide]{@link https://notifi-network.github.io/notifi-sdk-ts/} for more information on creating Alerts
 */
export type ClientCreateBonfidaAuctionSourceInput = Readonly<{
  auctionAddressBase58: string;
  auctionName: string;
}>;

/**
 * Input param for deleting an Alert
 *
 * @property alertId - The ID of the Alert to delete
 * @property keepTargetGroup - Whether to keep the target group on this Alert or to delete it
 * @property keepSourceGroup - Whether to keep the source group on this Alert or to delete it
 *
 * See [Alert Creation Guide]{@link https://notifi-network.github.io/notifi-sdk-ts/} for more information on creating Alerts
 */
export type ClientDeleteAlertInput = Readonly<{
  alertId: string;
  keepTargetGroup?: boolean;
  keepSourceGroup?: boolean;
}>;

/**
 * Input params for creating or updating a TargetGroup by name
 *
 * @property name - The name of the TargetGroup
 * @property emailAddress - The emailAddress to be used
 * @property phoneNumber - The phone number to be used
 * @property telegramId - The Telegram account username to be used
 * <br>
 * <br>
 */
export type ClientEnsureTargetGroupInput = Readonly<{
  name: string;
  emailAddress: string | undefined;
  phoneNumber: string | undefined;
  telegramId: string | undefined;
  webhook?: ClientCreateWebhookParams;
  includeDiscord: boolean;
}>;

/**
 * Input params for creating or updating a SourceGroup by name
 *
 * @property name - The name of the SourceGroup
 * @property sources - The Sources to be set on the SourceGroup
 */
export type ClientEnsureSourceGroupInput = Readonly<{
  name: string;
  sources: ReadonlyArray<CreateSourceInput>;
}>;

/**
 * Input params for the send verification request
 *
 * @property targetId -- the id of the EmailTarget
 */
export type ClientSendVerificationEmailInput = Readonly<{
  targetId: string;
}>;

export type ClientBroadcastMessageInput = Readonly<{
  topic: UserTopic;
  subject: string;
  message: string;
  isHolderOnly: boolean;
  variables?: Readonly<Record<string, string>>;
}>;

export type ClientFetchSubscriptionCardInput = Omit<
  FindTenantConfigInput,
  'tenant'
>;

// TODO: Dedupe from FrontendClient
export type Uint8SignMessageFunction = (
  message: Uint8Array,
) => Promise<Uint8Array>;

export type AptosSignMessageFunction = (
  message: string,
  nonce: number,
) => Promise<string>;

export type XionSignMessageFunction = (message: Uint8Array) => Promise<string>;

type hexString = `0x${string}`;

export type AcalaSignMessageFunction = (
  acalaAddress: string,
  message: string,
) => Promise<hexString>;

export type SignMessageParams =
  | Readonly<{
      walletBlockchain: 'SOLANA';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain:
        | 'ETHEREUM'
        | 'POLYGON'
        | 'ARBITRUM'
        | 'AVALANCHE'
        | 'BINANCE'
        | 'INJECTIVE'
        | 'OSMOSIS'
        | 'NIBIRU'
        | 'OPTIMISM'
        | 'ZKSYNC'
        | 'BASE'
        | 'BLAST'
        | 'CELO'
        | 'MANTLE'
        | 'LINEA'
        | 'SCROLL'
        | 'MANTA'
        | 'MONAD';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'XION';
      message: string;
      signMessage: XionSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'APTOS';
      signMessage: AptosSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'ACALA';
      signMessage: AcalaSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'NEAR';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'SUI';
      signMessage: Uint8SignMessageFunction;
    }>;

export type WalletParams =
  | Readonly<{
      walletBlockchain: 'SOLANA';
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain:
        | 'ETHEREUM'
        | 'POLYGON'
        | 'ARBITRUM'
        | 'AVALANCHE'
        | 'BINANCE'
        | 'OPTIMISM'
        | 'ZKSYNC'
        | 'BASE'
        | 'BLAST'
        | 'CELO'
        | 'MANTLE'
        | 'LINEA'
        | 'SCROLL'
        | 'MANTA'
        | 'MONAD';
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: 'APTOS';
      accountAddress: string;
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: 'XION';
      walletPublicKey: string;
      signingAddress: string;
      signingPubkey: string;
      signMessage: XionSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'ACALA';
      accountAddress: string;
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: 'NEAR';
      accountAddress: string;
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: 'SUI';
      accountAddress: string;
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: 'INJECTIVE';
      accountAddress: string;
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: 'OSMOSIS';
      accountAddress: string;
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: 'NIBIRU';
      accountAddress: string;
      walletPublicKey: string;
    }>;

export type WalletWithSignMessage =
  | Readonly<{
      walletBlockchain: 'SOLANA';
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain:
        | 'ETHEREUM'
        | 'POLYGON'
        | 'ARBITRUM'
        | 'AVALANCHE'
        | 'BINANCE'
        | 'OPTIMISM'
        | 'ZKSYNC'
        | 'BASE'
        | 'BLAST'
        | 'CELO'
        | 'MANTLE'
        | 'LINEA'
        | 'SCROLL'
        | 'MANTA'
        | 'MONAD';
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'APTOS';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: AptosSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'XION';
      walletPublicKey: string;
      signingAddress: string;
      signingPubkey: string;
      message: string;
      signMessage: XionSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'ACALA';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: AcalaSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'NEAR';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'SUI';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'INJECTIVE';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>;

export type WalletWithSignParams = Readonly<{
  displayName?: string;
}> &
  WalletWithSignMessage;

export type ConnectWalletParams = Readonly<{
  walletParams: WalletWithSignParams;
  connectWalletConflictResolutionTechnique: ConnectWalletInput['connectWalletConflictResolutionTechnique'];
}>;

export type NotifiClient = Readonly<{
  beginLoginViaTransaction: () => Promise<BeginLoginViaTransactionResult>;
  broadcastMessage: (
    input: ClientBroadcastMessageInput,
    signer: SignMessageParams,
  ) => Promise<string | null>;
  completeLoginViaTransaction: (
    input: CompleteLoginViaTransactionInput,
  ) => Promise<CompleteLoginViaTransactionResult>;
  fetchData: (forceFetch?: boolean) => Promise<ClientData>;
  logIn: (signer: SignMessageParams) => Promise<User>;
  logOut: () => Promise<void>;
  connectWallet: (input: ConnectWalletParams) => Promise<ConnectedWallet>;
  createAlert: (input: ClientCreateAlertInput) => Promise<Alert>;
  createSource: (
    input: Types.CreateSourceInput,
  ) => Promise<Types.SourceFragmentFragment>;
  createMetaplexAuctionSource: (
    input: ClientCreateMetaplexAuctionSourceInput,
  ) => Promise<Types.SourceFragmentFragment>;
  createBonfidaAuctionSource: (
    input: ClientCreateBonfidaAuctionSourceInput,
  ) => Promise<Types.SourceFragmentFragment>;
  deleteAlert: (input: ClientDeleteAlertInput) => Promise<string>;
  getConfiguration: () => Promise<ClientConfiguration>;
  getFusionNotificationHistory: (
    input: GetFusionNotificationHistoryInput,
  ) => Promise<
    Types.GetFusionNotificationHistoryQuery['fusionNotificationHistory']
  >;
  getNotificationHistory: (
    input: GetNotificationHistoryInput,
  ) => Promise<NotificationHistory>;
  getTopics: () => Promise<ReadonlyArray<UserTopic>>;
  getUnreadNotificationHistoryCount: () => Promise<
    Types.GetUnreadNotificationHistoryCountQuery['unreadNotificationHistoryCount']
  >;
  updateAlert: (input: ClientUpdateAlertInput) => Promise<Alert>;
  ensureTargetGroup: (
    input: ClientEnsureTargetGroupInput,
  ) => Promise<TargetGroup>;
  ensureSourceGroup: (
    input: ClientEnsureSourceGroupInput,
  ) => Promise<SourceGroup>;
  sendEmailTargetVerification: (
    input: ClientSendVerificationEmailInput,
  ) => Promise<string>;
  fetchSubscriptionCard: (
    input: ClientFetchSubscriptionCardInput,
  ) => Promise<TenantConfig>;
  createDiscordTarget: (input: string) => Promise<string | undefined>;
  markFusionNotificationHistoryAsRead: (
    input: Types.MarkFusionNotificationHistoryAsReadMutationVariables,
  ) => Promise<
    Types.MarkFusionNotificationHistoryAsReadMutation['markFusionNotificationHistoryAsRead']
  >;
}>;
