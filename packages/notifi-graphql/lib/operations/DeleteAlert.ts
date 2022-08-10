import {
  DeleteAlertMutation,
  DeleteAlertMutationVariables,
} from '../gql/generated';

export type DeleteAlertService = Readonly<{
  deleteAlert: (
    variables: DeleteAlertMutationVariables,
  ) => Promise<DeleteAlertMutation>;
}>;
