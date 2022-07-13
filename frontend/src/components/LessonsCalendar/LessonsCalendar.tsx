import styled from '@emotion/styled';
import { getHours, isAfter, setHours, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import { Calendar, Views, Event, SlotInfo } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { isRangeAvailable, localizer } from './LessonsCalendar.utils';

export interface RequiredEvent extends Event {
  start: Date;
  end: Date;
}

interface LessonsCalendarProps {
  instructorEvents: RequiredEvent[];
  userEvents: RequiredEvent[];
  createEvent: (event: RequiredEvent) => Promise<void>;
  selectedDate: Date;
}

export const LessonsCalendar = ({
  instructorEvents,
  userEvents,
  createEvent,
  selectedDate,
}: LessonsCalendarProps) => {
  const { showInfoSnackbar } = useCommonSnackbars();
  const [eventBeingCreate, setEventBeingCreate] =
    useState<RequiredEvent | null>(null);

  const onSelectSlot = async (slotInfo: SlotInfo) => {
    if (slotInfo.action !== 'select') {
      return;
    }

    if (!isRangeAvailable(slotInfo, instructorEvents)) {
      showInfoSnackbar('Lekcja w podanych godzinach nie jest dostępna.');
      return;
    }

    const newEvent: RequiredEvent = {
      start: slotInfo.start,
      end: slotInfo.end,
    };
    setEventBeingCreate(newEvent);
    await createEvent(newEvent);
    setEventBeingCreate(null);
  };

  const onSelecting = (range: { start: Date; end: Date }) => {
    return isAfter(range.end, startOfDay(new Date()));
  };

  const minimumAvailabilityStartTime = useMemo(() => {
    return Math.min(
      ...userEvents.map(({ start }) => getHours(start)),
      ...instructorEvents.map(({ start }) => getHours(start)),
    );
  }, [instructorEvents, userEvents]);

  return (
    <StylingWrapper>
      <Calendar
        view={Views.WEEK}
        onView={() => undefined}
        events={[
          ...userEvents,
          ...(eventBeingCreate ? [eventBeingCreate] : []),
        ]}
        date={selectedDate}
        onNavigate={() => undefined}
        backgroundEvents={instructorEvents}
        localizer={localizer}
        selectable
        onSelectSlot={onSelectSlot}
        onSelecting={onSelecting}
        scrollToTime={setHours(
          startOfDay(new Date()),
          minimumAvailabilityStartTime - 1,
        )}
        style={{
          flex: '1 1',
          height: 'auto',
          minHeight: ' 0',
        }}
        culture="pl"
        messages={{
          next: 'Następny tydzień',
          previous: 'Następny poprzedni tydzień',
        }}
      />
    </StylingWrapper>
  );
};

const StylingWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .rbc-background-event {
    pointer-events: none;
    border-color: rgb(26, 150, 19, 1);
    background: rgb(26, 150, 19, 0.66);
  }

  .rbc-allday-cell {
    display: none;
  }

  .rbc-time-header-cell .rbc-header {
    border-bottom: none;
  }

  .rbc-toolbar {
    display: none;
  }

  .rbc-time-slot {
    min-height: 32px;
  }

  .rbc-current-time-indicator {
    display: none;
  }
`;
