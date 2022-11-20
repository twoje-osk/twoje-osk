import { set } from 'date-fns';

export function combineDateWithTime(date: Date, time: Date) {
  return set(date, {
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });
}
