import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  GetConversationMessagesFullInput,
  GetConversationMessagesResult,
} from '@notifi-network/notifi-core';

import { ConvMessagePageInfoFragment } from '../fragments/convMessagePageInfoFragment';

const DEPENDENCIES = [ConvMessagePageInfoFragment];

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
