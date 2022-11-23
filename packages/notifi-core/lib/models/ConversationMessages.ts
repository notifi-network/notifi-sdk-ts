export type ConversationMessages = Readonly<{
  nodes?: Array<ConversationMessagesEntry> | undefined;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | undefined;
  };
}>;

export type ConversationMessagesEntry = Readonly<{
  __typename?: 'ConversationMessage';
  conversationParticipant: Array<Participant>;
  id: string;
  message: string;
  userId: string;
  createdDate: string;
  updatedDate: string;
  conversationId: string;
}>;

export type Participant = Readonly<{
  __typename?: 'Participant';
  profile: {
    __typename?: 'Profile';
    avatarData?: string | undefined;
    avatarDataType: string;
    id: string;
    preferredAddress?: string | undefined;
    preferredBlockchain?: string | undefined;
    preferredName?: string | undefined;
  };
  conversationId: string;
  resolvedName?: string | undefined;
  userId: string;
  walletAddress: string;
  walletBlockchain: string;
}>;
