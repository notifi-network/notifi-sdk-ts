import { Types } from '@notifi-network/notifi-graphql';

import { FusionNotificationHistory, Operation } from '../models';

export type GetFusionNotificationHistoryResult = FusionNotificationHistory;

export type GetFusionNotificationHistoryInput =
  Types.GetFusionNotificationHistoryQueryVariables;

export type GetFusionNotificationHistoryService = Readonly<{
  getFusionNotificationHistory: Operation<
    GetFusionNotificationHistoryInput,
    GetFusionNotificationHistoryResult
  >;
}>;
