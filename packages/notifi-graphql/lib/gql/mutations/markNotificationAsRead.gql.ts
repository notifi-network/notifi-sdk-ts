import { gql } from 'graphql-request';

import { NotificationHistoryEntryFragment } from '../fragments/NotificationHistoryEntryFragment.gql';

export const MarkNotificationAsRead = gql`
  mutation markNotificationsAsRead($input: MarkNotificationsAsReadInput!) {
    markNotificationsAsRead(input: $input) {
      ...NotificationHistoryEntryFragment
    }
  }
  ${NotificationHistoryEntryFragment}
`;
