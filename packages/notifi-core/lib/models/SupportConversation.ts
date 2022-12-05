import { Participant } from './ConversationMessages';

export type SupportConversation = Readonly<{
  __typename?: 'SupportConversation';
  id: string;
  conversationType: string;
  conversationGates?: ConversationGates | undefined;
  name: string;
  createdDate: string;
  participants: Array<Participant>;
  backgroundImageUrl: string;
}>;

export type ConversationGates = Readonly<{
  __typename?: 'ConversationGates';
  id: string;
}>;
