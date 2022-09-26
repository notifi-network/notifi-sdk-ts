import { gql } from 'graphql-request';

export const NotificationHistoryEntryFragment = gql`
  fragment NotificationHistoryEntryFragment on NotificationHistoryEntry {
    id
    category
    createdDate
    detail {
      __typename
      ... on BroadcastMessageEventDetails {
        type
        subject
        message
      }
    }
  }
`;
