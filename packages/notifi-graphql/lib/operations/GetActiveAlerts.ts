import {
  GetActiveAlertsQuery,
  GetActiveAlertsQueryVariables,
} from '../gql/generated';

export type GetActiveAlertsService = Readonly<{
  getActiveAlerts: (
    variables: GetActiveAlertsQueryVariables,
  ) => Promise<GetActiveAlertsQuery>;
}>;
