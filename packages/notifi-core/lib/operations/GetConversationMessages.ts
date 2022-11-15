import { Operation } from '../models';
import { ConversationMessages } from '../models/ConversationMessages';

export type GetConversationMessagesResult = ConversationMessages;

export type GetConversationMessagesInput = Readonly<{
  conversationId: string;
}>;

export type GetConversationMessagesFullInput = Readonly<{
  first?: number;
  after?: string;
  getConversationMessagesInput: GetConversationMessagesInput;
}>;

export type GetConversationMessagesService = Readonly<{
  getConversationMessages: Operation<
    GetConversationMessagesFullInput,
    GetConversationMessagesResult
  >;
}>;
