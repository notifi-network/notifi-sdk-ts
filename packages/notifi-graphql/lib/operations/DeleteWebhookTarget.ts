import {
  DeleteWebhookTargetMutation,
  DeleteWebhookTargetMutationVariables,
} from '../gql/generated';

export type DeleteWebhookTargetService = Readonly<{
  deleteWebhookTarget: (
    variables: DeleteWebhookTargetMutationVariables,
  ) => Promise<DeleteWebhookTargetMutation>;
}>;
