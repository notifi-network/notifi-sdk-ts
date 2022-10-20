import { GetNotificationHistoryResult } from '@notifi-network/notifi-core';
import { format, parseISO } from 'date-fns';

import { NotificationTypeName } from '../../../notifi-axios-adapter/lib/fragments/notificationHistoryEntryFragment';

// export enum NotificationTypeName {
//   ACCOUNT_BALANCE_CHANGED = 'AccountBalanceChangedEventDetails',
//   BROADCAST_MESSAGE = 'BroadcastMessageEventDetails',
//   DIRECT_TENANT_MESSAGE = 'DirectTenantMessageEventDetails',
//   NFT_COLLECTION_REPORT = 'NftCollectionsReportEventDetails',
//   CHAT_MESSAGE_RECEIVED = 'ChatMessageReceivedEventDetails',
//   DAO_PROPOSAL_CHANGED = 'DaoProposalChangedEventDetails',
//   NFT_AUCTION_CHANGED = 'NftAuctionChangedEventDetails',
//   WALLETS_ACTIVITY_CHANGED = 'WalletsActivityChangedEventDetails',
//   HEALTH_VALUE_OVER_THRESHOLD = 'HealthValueOverThresholdEventDetails',
//   GENERIC_EVENT = 'GenericEventDetails',
// }

const isDateInThisWeek = (date: string) => {
  const passedInDate = new Date(date);
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();

  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  return passedInDate >= firstDayOfWeek && passedInDate <= lastDayOfWeek;
};

const getDayName = (date: string) => {
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    new Date(date).getDay()
  ];
  return weekday;
};

export const formatTimestamp = (date: string): string => {
  try {
    if (isDateInThisWeek(date)) {
      return getDayName(date);
    }
    const parsedDate = parseISO(date);
    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const dateTime = format(parsedDate, 'dd');
    const finalDate = `${month} ${dateTime}`;
    return finalDate;
  } catch {
    return '-';
  }
};

export const notificationDescription = (
  notification: GetNotificationHistoryResult,
): string | undefined => {
  if (!notification) {
    return;
  }
  switch (notification) {
    case NotificationTypeName.ACCOUNT_BALANCE_CHANGED:
      return 'Account Balance';
    case NotificationTypeName.NFT_COLLECTION_REPORT:
      return 'NFT Collection Report';
    case NotificationTypeName.CHAT_MESSAGE_RECEIVED:
      return 'Chat Message';
    case NotificationTypeName.DAO_PROPOSAL_CHANGED:
      return 'DAO Proposal';
    case NotificationTypeName.WALLETS_ACTIVITY:
      return 'Wallet Activity';
    case NotificationTypeName.HEALTH_VALUE_OVER_THRESHOLD:
      return 'Health Value';
    case NotificationTypeName.GENERIC_EVENT:
      return 'Health Value';
  }
  return 'New Notification';
};
