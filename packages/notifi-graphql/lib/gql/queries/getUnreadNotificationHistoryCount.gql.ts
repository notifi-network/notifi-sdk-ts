import { gql } from 'graphql-request';

export const GetUnreadNotificationHistoryCount = gql`
  query getUnreadNotificationHistoryCount($cardId: String) {
    unreadNotificationHistoryCount(input: { cardId: $cardId }) {
      count
    }
  }
`;
