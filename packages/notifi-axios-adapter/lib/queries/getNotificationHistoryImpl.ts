import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  GetNotificationHistoryInput,
  GetNotificationHistoryResult,
} from '@notifi-network/notifi-core';

import {
  notificationHistoryEntryFragment,
  notificationHistoryEntryFragmentDependencies,
} from '../fragments/notificationHistoryEntryFragment';

const DEPENDENCIES = [
  ...notificationHistoryEntryFragmentDependencies,
  notificationHistoryEntryFragment,
];

const QUERY = `query getNotificationHistory($after: String, $first: Int) {
  notificationHistory(after: $after, first: $first) {
    nodes {
      ...NotificationHistoryEntry
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`.trim();

const getNotificationHistoryImpl = makeRequest<
  GetNotificationHistoryInput,
  GetNotificationHistoryResult
>(collectDependencies(...DEPENDENCIES, QUERY), 'notificationHistory');

export default getNotificationHistoryImpl;
