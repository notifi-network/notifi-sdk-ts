import { Types } from '@notifi-network/notifi-graphql';
import { format, isToday, isWithinInterval, parseISO, subDays } from 'date-fns';

export type ValidEventDetail = Extract<
  Types.NotificationHistoryEntryFragmentFragment['detail'],
  { __typename: 'GenericEventDetails' }
>;

export const isDateInThisWeek = (date: string) => {
  const passedInDate = new Date(date);
  const todayObj = new Date();
  const todayDate = todayObj.getDate();

  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - 6));

  return passedInDate >= firstDayOfWeek;
};

export const getDayName = (date: string) => {
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    new Date(date).getDay()
  ];
  return weekday;
};

export const validateEventDetails = (
  details: object,
): details is ValidEventDetail => {
  return (
    '__typename' in details && details.__typename === 'GenericEventDetails'
  );
};

export const formatTimestampInHistoryRow = (timestamp: string) => {
  const dateObject = new Date(timestamp);
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  return format(
    new Date(timestamp),
    isToday(timestamp)
      ? 'h:mm b'
      : isWithinInterval(dateObject, { start: sevenDaysAgo, end: now })
      ? 'eeee'
      : dateObject.getFullYear() <= now.getFullYear() - 1
      ? 'MMM d yyyy'
      : 'MMM d',
  );
};

export const formatTimestampInHistoryDetail = (date: string): string => {
  try {
    const parsedDate = parseISO(date);

    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const clockTime = format(parsedDate, 'h:mm b');
    const dateTime = format(parsedDate, 'dd');
    const finalDate = `${month} ${dateTime}`;

    if (isToday(parsedDate)) {
      return clockTime;
    }
    return getDayName(date) + ', ' + finalDate + ', ' + clockTime;
  } catch {
    return '-';
  }
};
