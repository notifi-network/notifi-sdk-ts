import { gql } from 'graphql-request';

export const ParticipantFragment = gql`
  fragment Participant on ConversationParticipant {
    conversationId
    conversationParticipantType
    profile {
      avatarData
      avatarDataType
      id
      preferredAddress
      preferredBlockchain
      preferredName
    }
    resolvedName
    userId
    walletAddress
    walletBlockchain
  }
`;
