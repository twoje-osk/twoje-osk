import styled from '@emotion/styled';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { getHours, isAfter, setHours, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { Calendar, Views, SlotInfo } from 'react-big-calendar';
import { blue, green, grey, red } from '@mui/material/colors';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCommonSnackbars } from '../../../../hooks/useCommonSnackbars/useCommonSnackbars';
import {
  BackgroundEvent,
  FrontEvent,
  LessonEvent,
  LessonsCalendarProps,
  RequiredEvent,
} from './LessonsCalendar.types';
import {
  getBackgroundEvents,
  getFrontEvents,
  isRangeAvailable,
  localizer,
} from './LessonsCalendar.utils';
import { getTranslatedLessonStatus } from '../MyLessons.utils';

export const LessonsCalendar = ({
  instructorEvents,
  userEvents,
  createEvent,
  selectedDate,
  onLessonClick,
}: LessonsCalendarProps) => {
  const { showInfoSnackbar } = useCommonSnackbars();

  const onSelectSlot = async (slotInfo: SlotInfo) => {
    if (slotInfo.action !== 'select') {
      return;
    }

    if (!isRangeAvailable(slotInfo, instructorEvents)) {
      showInfoSnackbar('Lekcja w podanych godzinach nie jest dostępna.');
      return;
    }

    const newEvent: LessonEvent = {
      start: slotInfo.start,
      end: slotInfo.end,
      status: LessonStatus.Requested,
    };
    createEvent(newEvent);
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
      <Calendar<FrontEvent<LessonEvent> | BackgroundEvent<RequiredEvent>>
        view={Views.WEEK}
        onView={() => undefined}
        events={getFrontEvents(userEvents, ({ status }) =>
          getTranslatedLessonStatus(status),
        )}
        date={selectedDate}
        onNavigate={() => undefined}
        backgroundEvents={getBackgroundEvents(instructorEvents)}
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
        eventPropGetter={(event) => {
          if (event.type === 'background') {
            return {};
          }

          return {
            className: event.status,
          };
        }}
        onSelectEvent={(event) => {
          if (event.type === 'front') {
            onLessonClick(event);
          }
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
    background: ${green[200]};
    border-color: ${green[200]};
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

  .rbc-event {
    &.${LessonStatus.Accepted} {
      background: ${blue[500]};
      border-color: ${blue[600]};
    }

    &.${LessonStatus.Finished} {
      background: ${blue[200]};
      border-color: ${blue[300]};
    }

    &.${LessonStatus.Canceled} {
      background: ${red[500]};
      border-color: ${red[600]};
      opacity: 0.3;
    }

    &.${LessonStatus.Requested} {
      background: ${grey[500]};
      border-color: ${grey[600]};
    }
  }
`;
