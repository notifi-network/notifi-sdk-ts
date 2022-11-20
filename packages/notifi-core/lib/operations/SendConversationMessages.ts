import { Operation } from '../models';
import { ConversationMessagesEntry } from '../models/ConversationMessages';

export type SendConversationMessagesResult = ConversationMessagesEntry;

export type SendConversationMessageInput = Readonly<{
  sendConversationMessageInput: { conversationId: string; message: string };
}>;

export type SendConversationMessagesService = Readonly<{
  sendConversationMessages: Operation<
    SendConversationMessageInput,
    SendConversationMessagesResult
  >;
}>;
