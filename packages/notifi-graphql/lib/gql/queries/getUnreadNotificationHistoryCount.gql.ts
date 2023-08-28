import { gql } from 'graphql-request';

export const GetUnreadNotificationHistoryCount = gql`
  query getUnreadNotificationHistoryCount {
    unreadNotificationHistoryCount {
      count
    }
  }
`;
