import { Types } from '@notifi-network/notifi-graphql';

export type ConversationMessages = Readonly<{
  nodes?: Array<ConversationMessagesEntry> | undefined;
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string | undefined;
  };
}>;

export type ConversationMessagesEntry = NonNullable<
  NonNullable<Types.ConversationMessageFragment>
>;

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
  conversationParticipantType: string;
  resolvedName?: string | undefined;
  userId: string;
  walletAddress: string;
  walletBlockchain: string;
}>;
