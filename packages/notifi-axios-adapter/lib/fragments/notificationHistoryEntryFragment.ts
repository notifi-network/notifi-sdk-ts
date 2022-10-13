export const notifictionHistoryEntryFragment = `
fragment notificationHistoryEntryFragment on NotificationHistoryEntry {
  id
  createdDate
  detail {
    __typename
    ... on BroadcastMessageEventDetails {
      type
      subject
      message
    }
  }
}`.trim();

export const notifictionHistoryEntryFragmentDependencies = [];
