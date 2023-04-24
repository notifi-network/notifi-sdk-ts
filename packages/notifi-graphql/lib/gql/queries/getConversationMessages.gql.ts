import { gql } from 'graphql-request';

import { ConvMessagePageInfoFragment } from '../fragments/ConvMessagePageInfoFragment.gql';
import { ConversationMessageFragment } from '../fragments/ConversationMessageFragment.gql';

export const GetConversationMessages = gql`
  query getConversationMessages(
    $getConversationMessagesInput: GetConversationMessagesInput!
    $after: String
    $first: Int
  ) {
    conversationMessages(
      first: $first
      after: $after
      getConversationMessagesInput: $getConversationMessagesInput
    ) {
      nodes {
        ...ConversationMessage
      }
      pageInfo {
        ...ConvMessagePageInfo
      }
    }
  }
  ${ConvMessagePageInfoFragment}
  ${ConversationMessageFragment}
`;
