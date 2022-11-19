import { Operation } from '../models';
import { ConversationMessages } from '../models/ConversationMessages';

export type SendConversationMessagesResult = ConversationMessages;

export type SendConversationMessagesInput = Readonly<{
  conversationId: string;
  message: string;
}>;

export type SendConversationMessagesService = Readonly<{
  sendConversationMessages: Operation<
    SendConversationMessagesInput,
    SendConversationMessagesResult
  >;
}>;
