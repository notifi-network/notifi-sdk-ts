import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  MarkFusionNotificationHistoryAsReadInput,
  MarkFusionNotificationHistoryAsReadResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation markFusionNotificationHistoryAsRead(
  $ids: [String!]!
  $beforeId: String
  $readState: NotificationHistoryReadState
) {
  markFusionNotificationHistoryAsRead(
    input: { ids: $ids, beforeId: $beforeId, readState: $readState }
  )
}
`.trim();

const markFusionNotificationHistoryAsReadImpl = makeRequest<
  MarkFusionNotificationHistoryAsReadInput,
  MarkFusionNotificationHistoryAsReadResult
>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'markFusionNotificationHistoryAsRead',
);

export default markFusionNotificationHistoryAsReadImpl;
