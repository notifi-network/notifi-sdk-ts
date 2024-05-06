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

export type AccountBalanceChangedEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'AccountBalanceChangedEventDetails' }
>;

export type BroadcastMessageEventDetails = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'BroadcastMessageEventDetails' }
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
