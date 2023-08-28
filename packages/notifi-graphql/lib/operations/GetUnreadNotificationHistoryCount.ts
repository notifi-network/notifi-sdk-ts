import type {
  GetUnreadNotificationHistoryCountQuery,
  GetUnreadNotificationHistoryCountQueryVariables,
} from '../gql/generated';

export type GetUnreadNotificationHistoryCountService = Readonly<{
  getUnreadNotificationHistoryCount: (
    variables: GetUnreadNotificationHistoryCountQueryVariables,
  ) => Promise<GetUnreadNotificationHistoryCountQuery>;
}>;
