import { getDay } from 'date-fns';

export const getDayOfWeek = (date: Date) => {
  // Adjust for week staring on Sunday (in US) vs Monday (Europe)
  return (7 + (getDay(date) - 1)) % 7;
};
