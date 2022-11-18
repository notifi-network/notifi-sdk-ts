import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  SendConversationMessagesInput,
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
  SendConversationMessagesInput,
  SendConversationMessagesResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'sendConversationMessage');

export default sendConversationMessageImpl;
