import { gql } from 'graphql-request';

import { NotificationHistoryEntryFragment } from '../fragments/NotificationHistoryEntryFragment.gql';
import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';

export const GetNotificationHistory = gql`
  query getNotificationHistory($after: String, $first: Int) {
    notificationHistory(after: $after, first: $first) {
      nodes {
        ...NotificationHistoryEntryFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PageInfoFragment}
  ${NotificationHistoryEntryFragment}
`;
