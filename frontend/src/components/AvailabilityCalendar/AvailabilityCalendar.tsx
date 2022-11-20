import { Button, Icon } from '@mui/material';
import { getHours, setHours, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { Calendar, Components, SlotInfo, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import {
  StylingWrapper,
  WhiteButtonWrapper,
} from './AvailabilityCalendar.styled';
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
  eventColor,
  selectedDate,
  onEventUpdate,
  onEventCreate,
  canCreateEvent,
  onDelete,
  formats,
}: AvailabilityCalendarProps) => {
  const { showInfoSnackbar } = useCommonSnackbars();

  const scrollToTime = useMemo(() => {
    const minimumAvailabilityStartTime =
      events.length === 0
        ? 9
        : Math.min(...events.map(({ start }) => getHours(start)));

    return setHours(startOfDay(new Date()), minimumAvailabilityStartTime - 1);
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

  const components: Components<AvailabilityEvent, object> = useMemo(
    () => ({
      // eslint-disable-next-line react/no-unstable-nested-components
      event: (props) => (
        <WhiteButtonWrapper>
          <Button
            onClick={() => onDelete(props.event)}
            variant="outlined"
            startIcon={<Icon>delete</Icon>}
            color="error"
            fullWidth
          >
            Usuń
          </Button>
        </WhiteButtonWrapper>
      ),
    }),
    [onDelete],
  );

  return (
    <StylingWrapper eventColor={eventColor}>
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
        scrollToTime={scrollToTime}
        style={{
          flex: '1 1',
          height: 'auto',
          minHeight: ' 0',
        }}
        culture="pl"
        components={components}
        formats={formats}
      />
    </StylingWrapper>
  );
};
