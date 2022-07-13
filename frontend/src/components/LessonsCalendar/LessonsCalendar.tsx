import styled from '@emotion/styled';
import { Button, ButtonGroup, Icon } from '@mui/material';
import { addDays, getHours, isAfter, setHours, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import { Calendar, Views, Event, SlotInfo } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Flex } from 'reflexbox';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import {
  getTodayWeek,
  isRangeAvailable,
  localizer,
} from './LessonsCalendar.utils';

export interface RequiredEvent extends Event {
  start: Date;
  end: Date;
}

interface LessonsCalendarProps {
  instructorEvents: RequiredEvent[];
  userEvents: RequiredEvent[];
  createEvent: (event: RequiredEvent) => Promise<void>;
}

export const LessonsCalendar = ({
  instructorEvents,
  userEvents,
  createEvent,
}: LessonsCalendarProps) => {
  const { showInfoSnackbar } = useCommonSnackbars();
  const [eventBeingCreate, setEventBeingCreate] =
    useState<RequiredEvent | null>(null);
  const [date, setDate] = useState(getTodayWeek());

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

  const onPrevWeekClick = () => {
    setDate(addDays(date, -7));
  };

  const onTodayClick = () => {
    setDate(getTodayWeek());
  };

  const onNextWeekClick = () => {
    setDate(addDays(date, 7));
  };

  const minimumAvailabilityStartTime = useMemo(() => {
    return Math.min(...instructorEvents.map(({ start }) => getHours(start)));
  }, [instructorEvents]);

  return (
    <StylingWrapper>
      <Flex marginBottom={24}>
        <ButtonGroup disableElevation variant="outlined">
          <GroupedIconButton onClick={onPrevWeekClick}>
            <Icon>arrow_back</Icon>
          </GroupedIconButton>
          <Button variant="contained" onClick={onTodayClick}>
            Dzisiaj
          </Button>
          <GroupedIconButton onClick={onNextWeekClick}>
            <Icon>arrow_forward</Icon>
          </GroupedIconButton>
        </ButtonGroup>
      </Flex>
      <Calendar
        view={Views.WEEK}
        onView={() => undefined}
        events={[
          ...userEvents,
          ...(eventBeingCreate ? [eventBeingCreate] : []),
        ]}
        date={date}
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
`;

const GroupedIconButton = styled(Button)`
  padding-left: 5px;
  padding-right: 5px;
`;
