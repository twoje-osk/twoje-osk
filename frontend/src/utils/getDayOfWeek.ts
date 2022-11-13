import { getDay } from 'date-fns';

export const getDayOfWeek = (date: Date) => {
  return (7 + (getDay(date) - 1)) % 7;
};
