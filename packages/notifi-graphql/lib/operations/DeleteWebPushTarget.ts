import {
  DeleteWebPushTargetMutation,
  DeleteWebPushTargetMutationVariables,
} from '../gql/generated';

export type DeleteWebPushTargetService = Readonly<{
  deleteWebPushTarget: (
    variables: DeleteWebPushTargetMutationVariables,
  ) => Promise<DeleteWebPushTargetMutation['deleteWebPushTarget']>;
}>;
