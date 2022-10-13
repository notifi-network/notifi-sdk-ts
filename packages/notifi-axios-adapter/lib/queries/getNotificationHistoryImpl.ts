import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  GetNotificationHistoryInput,
  GetNotificationHistoryResult,
} from '@notifi-network/notifi-core';

import {
  notifictionHistoryEntryFragment,
  notifictionHistoryEntryFragmentDependencies,
} from './../fragments/notificationHistoryEntryFragment';

const DEPENDENCIES = [
  ...notifictionHistoryEntryFragmentDependencies,
  ...notifictionHistoryEntryFragment,
];
const QUERY = `
query getNotificationHistory {
  notificationHistory {
    nodes{
      ...notificationHistoryEntryFragment
    }
    pageInfo{
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
