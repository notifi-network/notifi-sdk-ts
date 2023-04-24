import { gql } from 'graphql-request';

import { ConversationMessageFragment } from '../fragments/ConversationMessageFragment.gql';

export const SendConversationMessages = gql`
  mutation sendConversationMessage(
    $sendConversationMessageInput: SendConversationMessageInput!
  ) {
    sendConversationMessage(
      sendConversationMessageInput: $sendConversationMessageInput
    ) {
      ...ConversationMessage
    }
  }
  ${ConversationMessageFragment}
`;
