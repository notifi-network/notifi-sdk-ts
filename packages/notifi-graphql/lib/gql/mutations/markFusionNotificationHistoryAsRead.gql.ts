import { gql } from 'graphql-request';

export const MarkFusionNotificationHistoryAsRead = gql`
  mutation markFusionNotificationHistoryAsRead(
    $ids: [String!]!
    $beforeId: String
    $readState: NotificationHistoryReadState
  ) {
    markFusionNotificationHistoryAsRead(
      input: { ids: $ids, beforeId: $beforeId, readState: $readState }
    )
  }
`;
