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

export type NotificationHistory = Readonly<{
  nodes?:
    | Array<{
        __typename?: 'NotificationHistoryEntry';
        id: string;
        createdDate: string;
        detail?:
          | { __typename: 'AccountBalanceChangedEventDetails' }
          | {
              __typename: 'BroadcastMessageEventDetails';
              type: string;
              subject?: string | undefined;
              message?: string | undefined;
            }
          | { __typename: 'ChatMessageReceivedEventDetails' }
          | { __typename: 'DAOProposalChangedEventDetails' }
          | { __typename: 'DirectTenantMessageEventDetails' }
          | { __typename: 'GenericEventDetails' }
          | { __typename: 'HealthValueOverThresholdEventDetails' }
          | { __typename: 'NftAuctionChangedEventDetails' }
          | { __typename: 'NftCollectionsReportEventDetails' }
          | { __typename: 'WalletsActivityReportEventDetails' }
          | undefined;
      }>
    | undefined;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | undefined;
  };
}>;
