import {
  SendConversationMessageMutation,
  SendConversationMessageMutationVariables,
} from '../gql/generated';

export type SendConversationMessageService = Readonly<{
  sendConversationMessages: (
    variables: SendConversationMessageMutationVariables,
  ) => Promise<SendConversationMessageMutation>;
}>;
