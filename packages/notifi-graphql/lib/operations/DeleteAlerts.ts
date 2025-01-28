import {
  DeleteAlertsMutation,
  DeleteAlertsMutationVariables,
} from '../gql/generated';

export type DeleteAlertsService = Readonly<{
  deleteAlerts: (
    variables: DeleteAlertsMutationVariables,
  ) => Promise<DeleteAlertsMutation>;
}>;
