import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  GetFusionNotificationHistoryInput,
  GetFusionNotificationHistoryResult,
} from '@notifi-network/notifi-core';

import { fusionNotificationHistoryEntryFragment } from '../fragments/fusionNotificationHistoryEntryFragment';

const DEPENDENCIES = [fusionNotificationHistoryEntryFragment];

const QUERY = `query getFusionNotificationHistory($after: String, $first: Int) {
  fusionNotificationHistory(after: $after, first: $first) {
    nodes {
      ...FusionNotificationHistoryEntry
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`.trim();

const getFusionNotificationHistoryImpl = makeRequest<
  GetFusionNotificationHistoryInput,
  GetFusionNotificationHistoryResult
>(collectDependencies(...DEPENDENCIES, QUERY), 'fusionNotificationHistory');

export default getFusionNotificationHistoryImpl;
