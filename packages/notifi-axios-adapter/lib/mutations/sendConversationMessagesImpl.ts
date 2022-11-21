import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  SendConversationMessageInput,
  SendConversationMessagesResult,
} from '@notifi-network/notifi-core';

import {
  conversationMessageFragment,
  conversationMessageFragmentDependencies,
} from '../fragments/conversationMessageFragment';

const DEPENDENCIES = [
  ...conversationMessageFragmentDependencies,
  conversationMessageFragment,
];

const MUTATION = `
mutation sendConversationMessage($sendConversationMessageInput: SendConversationMessageInput!) {
  sendConversationMessage(sendConversationMessageInput: $sendConversationMessageInput) {
    ...ConversationMessage
  }
}
`.trim();

const sendConversationMessageImpl = makeRequest<
  SendConversationMessageInput,
  SendConversationMessagesResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'sendConversationMessage');

export default sendConversationMessageImpl;
