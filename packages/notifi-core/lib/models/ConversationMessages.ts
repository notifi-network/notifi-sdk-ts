export type ConversationMessages = Readonly<{
  nodes?: Array<ConversationMessagesEntry> | undefined;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | undefined;
  };
}>;

export type ConversationMessagesEntry = Readonly<{
  __typename?: 'ConversationMessage';
  id: string;
  message: string;
  userId: string;
  createdDate: string;
  updatedDate: string;
  conversationId: string;
}>;
