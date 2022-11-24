export const participantFragment = `
fragment Participant on ConversationParticipant {
  conversationId
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

export const participantFragmentDependencies = [participantFragment];
