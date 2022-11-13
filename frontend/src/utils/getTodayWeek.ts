import { startOfWeek } from 'date-fns';

export function getTodayWeek() {
  return startOfWeek(new Date(), {
    weekStartsOn: 1,
  });
}
