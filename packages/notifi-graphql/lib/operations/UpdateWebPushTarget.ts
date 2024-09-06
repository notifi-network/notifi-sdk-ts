import {
  UpdateWebPushTargetMutation,
  UpdateWebPushTargetMutationVariables,
} from '../gql/generated';

export type UpdateWebPushTargetService = Readonly<{
  updateWebPushTarget: (
    variables: UpdateWebPushTargetMutationVariables,
  ) => Promise<UpdateWebPushTargetMutation['updateWebPushTarget']>;
}>;
