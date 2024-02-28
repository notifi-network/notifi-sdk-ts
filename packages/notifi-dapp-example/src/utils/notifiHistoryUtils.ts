import { Types } from '@notifi-network/notifi-graphql';
import { format, isToday, isWithinInterval, subDays } from 'date-fns';

export type ParsedNotificationHistory = {
  timestamp: string;
  icon: string;
  topic: string;
  subject: string;
  message: string;
  read: boolean;
};

export type ValidEventDetail = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'GenericEventDetails' }
>;

export const validateEventDetails = (
  details: object,
): details is ValidEventDetail => {
  return (
    '__typename' in details && details.__typename === 'GenericEventDetails'
  );
};

export const parseNotificationHistory = (
  history: Types.FusionNotificationHistoryEntryFragmentFragment,
): ParsedNotificationHistory => {
  const eventDetails = history.detail;
  if (!eventDetails || eventDetails.__typename !== 'GenericEventDetails') {
    return {
      timestamp: '',
      topic: 'Unsupported Notification Type',
      icon: '',
      subject: 'Unsupported Notification Type',
      message:
        'Invalid notification history detail: only support GenericEventDetails',
      read: true,
    };
  }

  return {
    timestamp: formatTimestamp(history.createdDate),
    topic: eventDetails.sourceName,
    subject: eventDetails.notificationTypeName,
    message: eventDetails.genericMessageHtml ?? eventDetails.genericMessage,
    icon: eventDetails.icon,
    read: history.read,
  };
};

const formatTimestamp = (timestamp: string) => {
  const dateObject = new Date(timestamp);
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  return format(
    new Date(timestamp),
    isToday(timestamp)
      ? 'hh:mm b'
      : isWithinInterval(dateObject, { start: sevenDaysAgo, end: now })
      ? 'eeee'
      : 'MM/dd',
  );
};

export type HistoryRowIconStyle = {
  [key in Types.GenericEventIconHint]?: {
    iconColor: string;
    iconBackground: string;
  };
};

export const iconStyles: HistoryRowIconStyle = {
  CLOCK: {
    // Radial orange
    iconColor: 'text-white',
    iconBackground: 'bg-radial-gradient-orange',
  },
  DAO: {
    // People group blue
    iconColor: 'text-white',
    iconBackground: 'bg-radial-gradient-blue',
  },
  INFO: {
    // Green lightbulb
    iconColor: 'text-white',
    iconBackground: 'bg-radial-gradient-green',
  },
  URGENT: {
    // Red bell
    iconColor: 'text-white',
    iconBackground: 'bg-radial-gradient-red',
  },
};
