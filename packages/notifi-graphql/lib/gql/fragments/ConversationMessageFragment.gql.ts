import { gql } from 'graphql-request';

import { ParticipantFragment } from './ParticipantFragment.gql';

export const ConversationMessageFragment = gql`
  fragment ConversationMessage on ConversationMessage {
    id
    userId
    conversationId
    createdDate
    updatedDate
    message
    conversationParticipant {
      ...Participant
    }
  }
  ${ParticipantFragment}
`;
