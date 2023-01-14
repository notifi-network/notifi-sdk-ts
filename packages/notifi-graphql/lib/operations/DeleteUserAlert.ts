import {
  DeleteUserAlertMutation,
  DeleteUserAlertMutationVariables,
} from '../gql/generated';

export type DeleteUserAlertService = Readonly<{
  deleteUserAlert: (
    variables: DeleteUserAlertMutationVariables,
  ) => Promise<DeleteUserAlertMutation>;
}>;
