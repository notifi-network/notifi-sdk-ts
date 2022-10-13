import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetNotificationHistoryResult } from '@notifi-network/notifi-core';

import {
  notifictionHistoryEntryFragment,
  notifictionHistoryEntryFragmentDependencies,
} from './../fragments/notificationHistoryEntryFragment';

const DEPENDENCIES = [
  ...notifictionHistoryEntryFragmentDependencies,
  ...notifictionHistoryEntryFragment,
];
const MUTATION = `
query getNotificationHistory {
  notificationHistory {
    ...notificationHistoryEntryFragment
  }
}`.trim();

const getNotificationHistoryImpl =
  makeParameterLessRequest<GetNotificationHistoryResult>(
    collectDependencies(...DEPENDENCIES, MUTATION),
    'notificationHistoryEntry',
  );

export default getNotificationHistoryImpl;
