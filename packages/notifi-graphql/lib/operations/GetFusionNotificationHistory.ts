import type {
  GetFusionNotificationHistoryQuery,
  GetFusionNotificationHistoryQueryVariables,
} from '../gql/generated';

export type GetFusionNotificationHistoryService = Readonly<{
  getFusionNotificationHistory: (
    variables: GetFusionNotificationHistoryQueryVariables,
  ) => Promise<GetFusionNotificationHistoryQuery>;
}>;
