import { gql } from 'graphql-request';

export const CreateSupportConversation = gql`
  mutation createSupportConversation {
    createSupportConversation {
      id
      conversationType
      conversationGates {
        id
      }
      name
      createdDate
      participants {
        conversationParticipantType
        profile {
          id
          preferredAddress
          preferredName
          avatarData
          avatarDataType
        }
        resolvedName
      }
      backgroundImageUrl
    }
  }
`;
