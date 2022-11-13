import { getHours, setHours, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { Calendar, SlotInfo, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { StylingWrapper } from './AvailabilityCalendar.styled';
import {
  AvailabilityCalendarProps,
  AvailabilityEvent,
} from './AvailabilityCalendar.types';
import { localizer } from './AvailabilityCalendar.utils';

const DnDCalendar = withDragAndDrop<AvailabilityEvent>(Calendar);

interface OnCreateData {
  start: string | Date;
  end: string | Date;
}

interface OnUpdateData extends OnCreateData {
  event: AvailabilityEvent;
}
export const AvailabilityCalendar = ({
  events,
  selectedDate,
  onEventUpdate,
  onEventCreate,
  canCreateEvent,
}: AvailabilityCalendarProps) => {
  const { showInfoSnackbar } = useCommonSnackbars();

  const minimumAvailabilityStartTime = useMemo(() => {
    return Math.min(...events.map(({ start }) => getHours(start)));
  }, [events]);

  const onUpdate = ({ event, start, end }: OnUpdateData) => {
    onEventUpdate({
      ...event,
      start: typeof start === 'string' ? new Date(start) : start,
      end: typeof end === 'string' ? new Date(end) : end,
    });
  };

  const onCreate = ({ start, end }: OnCreateData) => {
    onEventCreate({
      start: typeof start === 'string' ? new Date(start) : start,
      end: typeof end === 'string' ? new Date(end) : end,
    });
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    if (slotInfo.action !== 'select') {
      return;
    }

    if (!canCreateEvent(slotInfo)) {
      showInfoSnackbar('Dostępność została już zadeklarowana w tym terminie.');
      return;
    }

    onCreate(slotInfo);
  };

  return (
    <StylingWrapper>
      <DnDCalendar
        view={Views.WEEK}
        onView={() => undefined}
        events={events}
        date={selectedDate}
        onNavigate={() => undefined}
        localizer={localizer}
        selectable
        onEventDrop={onUpdate}
        onEventResize={onUpdate}
        onSelectSlot={onSelectSlot}
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
        // onSelectEvent={(event) => {
        //   onLessonClick(event);
        // }}
      />
    </StylingWrapper>
  );
};
