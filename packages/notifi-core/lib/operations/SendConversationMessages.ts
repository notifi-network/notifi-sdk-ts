import { Operation } from '../models';
import { ConversationMessages } from '../models/ConversationMessages';

export type SendConversationMessagesInput = Readonly<{
  conversationId: string;
  message: string;
}>;

export type SendConversationMessagesResult = ConversationMessages;

export type SendConversationMessagesService = Readonly<{
  SendConversationMessages: Operation<
    SendConversationMessagesInput,
    ConversationMessages
  >;
}>;
