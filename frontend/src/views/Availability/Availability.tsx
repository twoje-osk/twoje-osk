import { ButtonGroup, Icon, Button, CircularProgress } from '@mui/material';
import { InstructorAvailabilityResponseDTO } from '@osk/shared';
import { useMemo } from 'react';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useSelectedDate } from '../../hooks/useSelectedDate/useSelectedDate';
import { LoaderOverlay } from '../Lessons/MyLessons/MyLessons.styled';
import { useEditEvent } from './Availability.hooks';
import {
  CalendarWrapper,
  FullPageRelativeWrapper,
  GroupedIconButton,
} from './Availability.styled';
import { isRangeAvailable } from './Availability.utils';
import { AvailabilityCalendar } from './AvailabilityCalendar/AvailabilityCalendar';
import { AvailabilityEvent } from './AvailabilityCalendar/AvailabilityCalendar.types';

export const Availability = () => {
  const { data, error, mutate } =
    useSWR<InstructorAvailabilityResponseDTO>('/api/availability');
  const { selectedDate, onPrevWeekClick, onTodayClick, onNextWeekClick } =
    useSelectedDate();

  const { onEventUpdate, onEventCreate, addedEvent, editedEvent } =
    useEditEvent({ mutate });

  const events = useMemo((): AvailabilityEvent[] => {
    if (data === undefined) {
      return [];
    }

    const apiEvents = data.availabilities.map(({ id, from, to }) => {
      if (editedEvent?.id === id) {
        return editedEvent;
      }

      return {
        id,
        start: new Date(from),
        end: new Date(to),
      };
    });

    return [...apiEvents, ...(addedEvent === null ? [] : [addedEvent])];
  }, [addedEvent, data, editedEvent]);

  const isUpdatingData = addedEvent !== null || editedEvent !== null;

  if (error) {
    return <GeneralAPIError />;
  }

  return (
    <FullPageRelativeWrapper>
      <Flex
        marginBottom={24}
        alignItems="center"
        justifyContent="space-between"
      >
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
      <CalendarWrapper>
        <AvailabilityCalendar
          selectedDate={selectedDate}
          events={events}
          onEventUpdate={onEventUpdate}
          onEventCreate={onEventCreate}
          canCreateEvent={(slotInfo) => isRangeAvailable(slotInfo, events)}
        />
        {(data === undefined || isUpdatingData) && (
          <LoaderOverlay>
            <CircularProgress />
          </LoaderOverlay>
        )}
      </CalendarWrapper>
    </FullPageRelativeWrapper>
  );
};
