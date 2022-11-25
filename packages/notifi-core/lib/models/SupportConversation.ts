export type SupportConversation = Readonly<{
  __typename?: 'SupportConversation';
  id: string;
  conversationType: string;
  conversationGates?: ConversationGates | undefined;
  name: string;
  createdDate: string;
  participants: Array<Participant>;
}>;

export type ConversationGates = Readonly<{
  __typename?: 'ConversationGates';
  id: string;
}>;

export type Participant = Readonly<{
  __typename?: 'Participant';
  conversationParticipantType: string;
  profile: {
    id: string;
    preferredAddress: string;
    preferredName?: string | undefined;
  };
  resolvedName?: string | undefined;
}>;
