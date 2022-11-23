import { format, parseISO } from 'date-fns';

export const sortByDate = <T>(
  getDate: (item: T) => Date,
  direction: 'ASC' | 'DESC',
): ((a: T, b: T) => number) => {
  return (a, b) => {
    const aDate = getDate(a);
    const bDate = getDate(b);

    switch (direction) {
      case 'ASC':
        return aDate.getTime() - bDate.getTime();
      case 'DESC':
        return bDate.getTime() - aDate.getTime();
    }
  };
};

export const formatConversationDateTimestamp = (date: string): string => {
  try {
    const parsedDate = parseISO(date);
    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const day = format(parsedDate, 'd');

    return `${month} ${day}`;
  } catch {
    return '';
  }
};

export const formatHourTimestamp = (date: string): string => {
  const parsedDate = parseISO(date);
  return format(parsedDate, 'H:mm');
};

export const formatConversationStartTimestamp = (date: string): string => {
  try {
    const parsedDate = parseISO(date);
    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const day = format(parsedDate, 'd');

    const finalTimestamp = isToday(parsedDate) ? 'Today' : `${month} ${day}`;
    return finalTimestamp;
  } catch {
    return '';
  }
};

export const isToday = (date: Date) => {
  const today = new Date();

  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
};
