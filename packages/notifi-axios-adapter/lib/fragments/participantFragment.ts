import { userProfileFragment } from './userProfileFragment';

export const participantFragment = `
fragment Participant on ConversationParticipant {
  conversationId
  profile {
    ...userProfileFragment
  }
  resolvedName
  userId
  walletAddress
  walletBlockchain
}
`.trim();

export const participantFragmentDependencies = [
  participantFragment,
  ...userProfileFragment,
];
