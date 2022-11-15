import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  GetConversationMessagesFullInput,
  GetConversationMessagesResult,
} from '@notifi-network/notifi-core';

import { conversationMessagePageInfoFragment } from '../fragments/conversationMessagePageInfoFragment';

const DEPENDENCIES = [conversationMessagePageInfoFragment];

const QUERY = `query conversationMessages(
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
      id
      message
      userId
      createdDate
      updatedDate
      conversationId
    }
    pageInfo {
      ...ConvMessagePageInfo
    }
  }
}`.trim();

const getConversationMessagesImpl = makeRequest<
  GetConversationMessagesFullInput,
  GetConversationMessagesResult
>(collectDependencies(...DEPENDENCIES, QUERY), 'conversationMessages');

export default getConversationMessagesImpl;
