import {
  CreateWebPushTargetMutation,
  CreateWebPushTargetMutationVariables,
} from '../gql/generated';

export type CreateWebPushTargetService = Readonly<{
  createWebPushTarget: (
    variables: CreateWebPushTargetMutationVariables,
  ) => Promise<CreateWebPushTargetMutation['createWebPushTarget']>;
}>;
