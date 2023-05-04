/**
 * Object describing Notification History
 *
 * @remarks
 * Object describing Notification History
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string} filterType - Type of the filter
 *
 */
import { Types } from '@notifi-network/notifi-graphql';

export type NotificationHistory = Readonly<{
  nodes: Array<Types.NotificationHistoryEntryFragmentFragment> | undefined;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | undefined;
  };
}>;

enum AccountBalanceChangeDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

enum NftCollectionsReportType {
  HOT = 'HOT',
  MOST_TRADED = 'MOST_TRADED',
}

enum WalletsActivityReportType {
  MOST_ACTIVE = 'MOST_ACTIVE',
}

export type Target = {
  type: TargetType;
  name?: string;
};

enum TargetType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  TELEGRAM = 'TELEGRAM',
  WEBHOOK = 'WEBHOOK',
}

enum WalletBlockchain {
  ACALA = 'ACALA',
  APTOS = 'APTOS',
  ARBITRUM = 'ARBITRUM',
  AVALANCHE = 'AVALANCHE',
  BINANCE = 'BINANCE',
  ETHEREUM = 'ETHEREUM',
  NEAR = 'NEAR',
  OFF_CHAIN = 'OFF_CHAIN',
  POLYGON = 'POLYGON',
  SOLANA = 'SOLANA',
  OPTIMISM = 'OPTIMISM',
}

export type AccountBalanceChangedEventDetails = {
  __typename: 'AccountBalanceChangedEventDetails';
  walletBlockchain: WalletBlockchain;
  direction: AccountBalanceChangeDirection;
  newValue: number;
  previousValue: number;
  tokenSymbol: string;
  isWhaleWatch: boolean;
};

export type BroadcastMessageEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'BroadcastMessageEventDetails' }
>;

export type ChatMessageReceivedEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'ChatMessageReceivedEventDetails' }
>;

export type DAOProposalChangedEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'DAOProposalChangedEventDetails' }
>;

export type DirectTenantMessageEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'DirectTenantMessageEventDetails' }
>;

export type GenericEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'GenericEventDetails' }
>;

// With Fallback because it is not queried in gql fragments
export type GenericEventAction = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'GenericEventAction' }
> extends never
  ? Types.GenericEventAction
  : never;

export type HealthValueOverThresholdEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'HealthValueOverThresholdEventDetails' }
>;

export type NftAuctionChangedEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'NftAuctionChangedEventDetails' }
>;

export type NftCollectionsReportEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'NftCollectionsReportEventDetails' }
>;

export type NftCollectionStats = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'NftCollectionStats' }
>;

export type WalletsActivityReportEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'WalletsActivityReportEventDetails' }
>;

export type WalletsActivityReportWallet = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'WalletsActivityReportWallet' }
>;

export type EntryDetailType =
  | AccountBalanceChangedEventDetails
  | BroadcastMessageEventDetails
  | ChatMessageReceivedEventDetails
  | DAOProposalChangedEventDetails
  | DirectTenantMessageEventDetails
  | GenericEventDetails
  | HealthValueOverThresholdEventDetails
  | NftAuctionChangedEventDetails
  | NftCollectionsReportEventDetails
  | WalletsActivityReportEventDetails;

export type NotificationHistoryEntry = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'NotificationHistoryEntry' }
>;
