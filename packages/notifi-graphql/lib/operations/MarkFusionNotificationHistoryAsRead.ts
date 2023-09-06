import {
  MarkFusionNotificationHistoryAsReadMutation,
  MarkFusionNotificationHistoryAsReadMutationVariables,
} from '../gql/generated';

export type MarkFusionNotificationHistoryAsReadService = Readonly<{
  markFusionNotificationHistoryAsRead: (
    variables: MarkFusionNotificationHistoryAsReadMutationVariables,
  ) => Promise<MarkFusionNotificationHistoryAsReadMutation>;
}>;
