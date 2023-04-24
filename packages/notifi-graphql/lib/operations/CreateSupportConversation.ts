import {
  CreateSupportConversationMutation,
  CreateSupportConversationMutationVariables,
} from '../gql/generated';

export type CreateSupportConversationService = Readonly<{
  createSupportConversation: (
    variables: CreateSupportConversationMutationVariables,
  ) => Promise<CreateSupportConversationMutation>;
}>;
