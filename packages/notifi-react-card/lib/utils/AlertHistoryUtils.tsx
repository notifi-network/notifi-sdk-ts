import { format, parseISO } from 'date-fns';

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

export const formatAmount = (amount: number): string =>
  parseFloat(amount.toFixed(9)).toString();

export const isToday = (date: Date) => {
  const today = new Date();

  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
};
export const formatAlertDetailsTimestamp = (date: string) => {
  try {
    const parsedDate = parseISO(date);

    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const clockTime = format(parsedDate, 'HH:mm');
    const dateTime = format(parsedDate, 'dd');
    const finalDate = `${month} ${dateTime} at ${clockTime} `;

    return finalDate;
  } catch {
    return '-';
  }
};

export const formatTimestamp = (date: string): string => {
  try {
    const parsedDate = parseISO(date);

    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const clockTime = format(parsedDate, 'HH:mm');
    const dateTime = format(parsedDate, 'dd');
    const finalDate = `${month} ${dateTime}`;

    if (isToday(parsedDate)) {
      return clockTime;
    }

    if (isDateInThisWeek(date)) {
      return getDayName(date);
    }
    return finalDate;
  } catch {
    return '-';
  }
};
