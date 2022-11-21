export const conversationMessageFragment = `
fragment ConversationMessage on ConversationMessage {
  id
  userId
  conversationId
  createdDate
  updatedDate
  message
}
`.trim();

export const conversationMessageFragmentDependencies = [];
