import { Types } from '@notifi-network/notifi-graphql';

import { Operation } from '../models';

export type MarkFusionNotificationHistoryAsReadInput =
  Types.MarkFusionNotificationHistoryAsReadMutationVariables;
export type MarkFusionNotificationHistoryAsReadResult =
  Types.MarkFusionNotificationHistoryAsReadMutation['markFusionNotificationHistoryAsRead'];

export type MarkFusionNotificationHistoryAsReadService = Readonly<{
  markFusionNotificationHistoryAsRead: Operation<
    MarkFusionNotificationHistoryAsReadInput,
    MarkFusionNotificationHistoryAsReadResult
  >;
}>;
