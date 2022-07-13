import { dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import plPL from 'date-fns/locale/pl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { isAfter, isBefore, isEqual } from 'date-fns';
import type { RequiredEvent } from './LessonsCalendar';

const locales = {
  pl: plPL,
};
export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function isRangeAvailable(
  range: { start: Date; end: Date },
  instructorEvents: RequiredEvent[],
) {
  const { start, end } = range;

  return instructorEvents.some(
    ({ start: instructorEventStart, end: instructorEventEnd }) => {
      const afterCondition =
        isAfter(start, instructorEventStart) ||
        isEqual(start, instructorEventStart);

      const beforeCondition =
        isBefore(end, instructorEventEnd) || isEqual(end, instructorEventEnd);

      return afterCondition && beforeCondition;
    },
  );
}

export function getTodayWeek() {
  return startOfWeek(new Date(), {
    weekStartsOn: 1,
  });
}
