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

export const formatHourTimestamp = (date: string): string => {
  const parsedDate = parseISO(date);
  return format(parsedDate, 'H:mm');
};

export const isToday = (date: Date) => {
  const today = new Date();

  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
};
