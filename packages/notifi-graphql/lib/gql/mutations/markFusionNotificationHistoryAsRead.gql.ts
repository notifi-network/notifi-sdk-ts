import { gql } from 'graphql-request';

export const MarkFusionNotificationHistoryAsRead = gql`
  mutation markFusionNotificationHistoryAsRead(
    $ids: [String!]!
    $beforeId: String
  ) {
    markFusionNotificationHistoryAsRead(
      input: { ids: $ids, beforeId: $beforeId }
    )
  }
`;
