import type {
  GetNotificationHistoryQuery,
  GetNotificationHistoryQueryVariables,
} from '../gql/generated';

export type GetNotificationHistoryService = Readonly<{
  getNotificationHistory: (
    variables: GetNotificationHistoryQueryVariables,
  ) => Promise<GetNotificationHistoryQuery>;
}>;
