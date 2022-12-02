import {
  participantFragment,
  participantFragmentDependencies,
} from './participantFragment';

export const conversationMessageFragment = `
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
`.trim();

export const conversationMessageFragmentDependencies = [
  ...participantFragmentDependencies,
  participantFragment,
];
