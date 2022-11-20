import { isAfter, isBefore } from 'date-fns';
import { DateLocalizer } from 'react-big-calendar';

interface Event {
  start: Date;
  end: Date;
}

export const isRangeAvailable = (event: Event, blockedEvents: Event[]) => {
  const conflictingEventExists = blockedEvents.some((blockedEvent) => {
    return (
      isBefore(event.start, blockedEvent.end) &&
      isAfter(event.end, blockedEvent.start)
    );
  });

  return !conflictingEventExists;
};

export const formatDayOfWeek = (
  date: Date,
  culture: string | undefined,
  localizer: DateLocalizer | undefined,
) => toFirstUpper(localizer?.format(date, 'cccc', culture) ?? '');

const toFirstUpper = (text: string) =>
  text.substring(0, 1).toUpperCase() + text.substring(1);
