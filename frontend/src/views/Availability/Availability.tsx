import { ButtonGroup, Icon, Button, CircularProgress } from '@mui/material';
import { InstructorAvailabilityResponseDTO } from '@osk/shared';
import { endOfWeek, formatISO } from 'date-fns';
import { useMemo } from 'react';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { green } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { ActionModal } from '../../components/ActionModal/ActionModal';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useSelectedDate } from '../../hooks/useSelectedDate/useSelectedDate';
import { LoaderOverlay } from '../Lessons/MyLessons/MyLessons.styled';
import {
  useCreateEvent,
  useDeleteEvent,
  useEditEvent,
} from './Availability.hooks';
import {
  CalendarWrapper,
  FullPageRelativeWrapper,
  GroupedIconButton,
} from './Availability.styled';
import { isRangeAvailable } from './Availability.utils';
import { AvailabilityCalendar } from '../../components/AvailabilityCalendar/AvailabilityCalendar';
import { AvailabilityEvent } from '../../components/AvailabilityCalendar/AvailabilityCalendar.types';

export const Availability = () => {
  const { selectedDate, onPrevWeekClick, onTodayClick, onNextWeekClick } =
    useSelectedDate();
  const currentlySelectedDateQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('from', formatISO(selectedDate));
    params.set('to', formatISO(endOfWeek(selectedDate, { weekStartsOn: 1 })));

    return params;
  }, [selectedDate]);

  const { data, error, mutate } = useSWR<InstructorAvailabilityResponseDTO>(
    `/api/availability?${currentlySelectedDateQueryParams}`,
  );

  const { onEventUpdate, editedEvent } = useEditEvent({ mutate });
  const { onEventCreate, addedEvent } = useCreateEvent({ mutate });
  const {
    onEventDelete,
    onDeleteClick,
    isDeleteModalLoading,
    isDeleteModalOpen,
    closeDeleteModal,
  } = useDeleteEvent({ mutate });

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
    <>
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
          <Button
            variant="outlined"
            component={Link}
            to="domyslna"
            startIcon={<Icon>edit</Icon>}
          >
            Edytuj Domyślne Ustawienia
          </Button>
        </Flex>
        <CalendarWrapper>
          <AvailabilityCalendar
            selectedDate={selectedDate}
            events={events}
            onEventUpdate={onEventUpdate}
            onEventCreate={onEventCreate}
            canCreateEvent={(slotInfo) => isRangeAvailable(slotInfo, events)}
            onDelete={onDeleteClick}
            eventColor={green}
          />
          {(data === undefined || isUpdatingData) && (
            <LoaderOverlay>
              <CircularProgress />
            </LoaderOverlay>
          )}
        </CalendarWrapper>
      </FullPageRelativeWrapper>
      <ActionModal
        id="deleteModal"
        actionButtonColor="error"
        actionButtonIcon="delete"
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteModalLoading}
        onClose={closeDeleteModal}
        onAction={onEventDelete}
        actionButtonText="Usuń"
        title="Czy na pewno chcesz usunąć tę dostępność?"
      />
    </>
  );
};
