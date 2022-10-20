import { format, parseISO } from 'date-fns';

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
