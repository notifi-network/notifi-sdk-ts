export const notifictionHistoryEntryFragment = `
fragment notificationHistoryEntryFragment on NotificationHistoryEntry {
  id
  category
  createdDate
  detail {
    ... on BroadcastMessageEventDetails {
      type
      subject
      message
    }
  }
}`.trim();

export const notifictionHistoryEntryFragmentDependencies = [];
