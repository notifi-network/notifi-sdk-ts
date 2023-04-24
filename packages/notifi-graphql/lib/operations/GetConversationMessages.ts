import {
  GetConversationMessagesQuery,
  GetConversationMessagesQueryVariables,
} from '../gql/generated';

export type GetConversationMessagesService = Readonly<{
  getConversationMessages: (
    variables: GetConversationMessagesQueryVariables,
  ) => Promise<GetConversationMessagesQuery>;
}>;
