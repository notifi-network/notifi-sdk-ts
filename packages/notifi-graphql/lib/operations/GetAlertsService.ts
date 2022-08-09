import { GetAlertsQuery, GetAlertsQueryVariables } from '../gql/generated';

export type GetAlertsService = Readonly<{
  getAlerts: (variables: GetAlertsQueryVariables) => Promise<GetAlertsQuery>;
}>;
