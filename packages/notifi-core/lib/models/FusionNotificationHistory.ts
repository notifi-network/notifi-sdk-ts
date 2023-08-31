import { Types } from '@notifi-network/notifi-graphql';

export type FusionNotificationHistory = Readonly<
  Types.GetFusionNotificationHistoryQuery['fusionNotificationHistory']
>;

export type FusionNotificationHistoryEntry = Extract<
  Types.FusionNotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'FusionNotificationHistoryEntry' }
>;
