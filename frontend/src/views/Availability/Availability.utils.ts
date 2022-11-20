import { isAfter, isBefore } from 'date-fns';

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
