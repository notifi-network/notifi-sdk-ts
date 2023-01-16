import {
  DeleteDirectPushAlertMutation,
  DeleteDirectPushAlertMutationVariables,
} from '../gql/generated';

export type DeleteDirectPushAlertService = Readonly<{
  deleteDirectPushAlert: (
    variables: DeleteDirectPushAlertMutationVariables,
  ) => Promise<DeleteDirectPushAlertMutation>;
}>;
