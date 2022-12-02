export const participantFragment = `
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
`.trim();

export const participantFragmentDependencies = [];
