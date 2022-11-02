import { gql } from 'graphql-request';

export const NotificationHistoryEntryFragment = gql`
  fragment NotificationHistoryEntryFragment on NotificationHistoryEntry {
    id
    category
    createdDate
    read
    detail {
      __typename
      ... on BroadcastMessageEventDetails {
        type
        subject
        message
      }
      ... on GenericEventDetails {
        notificationTypeName
        sourceName
        genericMessage: message
        action {
          name
          url
        }
      }
    }
  }
`;
