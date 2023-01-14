import {
  SendMessageMutation,
  SendMessageMutationVariables,
} from '../gql/generated';

export type SendMessageService = Readonly<{
  sendMessage: (
    variables: SendMessageMutationVariables,
  ) => Promise<SendMessageMutation>;
}>;
