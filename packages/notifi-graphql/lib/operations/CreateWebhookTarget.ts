import {
  CreateWebhookTargetMutation,
  CreateWebhookTargetMutationVariables,
} from '../gql/generated';

export type CreateWebhookTargetService = Readonly<{
  createWebhookTarget: (
    variables: CreateWebhookTargetMutationVariables,
  ) => Promise<CreateWebhookTargetMutation>;
}>;
