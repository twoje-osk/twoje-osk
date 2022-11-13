import { Icon, Button, CircularProgress } from '@mui/material';
import { InstructorDefaultAvailabilityResponseDTO } from '@osk/shared';
import { addDays, endOfWeek, formatISO, set } from 'date-fns';
import { useMemo } from 'react';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { blue } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { ActionModal } from '../../components/ActionModal/ActionModal';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { AvailabilityCalendar } from '../../components/AvailabilityCalendar/AvailabilityCalendar';
import { AvailabilityEvent } from '../../components/AvailabilityCalendar/AvailabilityCalendar.types';
import { LoaderOverlay } from '../Lessons/MyLessons/MyLessons.styled';
import {
  useCreateEvent,
  useDeleteEvent,
  useEditEvent,
} from './DefaultAvailability.hooks';
import {
  CalendarWrapper,
  FullPageRelativeWrapper,
} from './DefaultAvailability.styled';
import { formatDayOfWeek, isRangeAvailable } from './DefaultAvailability.utils';
import { getTodayWeek } from '../../utils/getTodayWeek';

export const DefaultAvailability = () => {
  const selectedDate = useMemo(() => getTodayWeek(), []);
  const currentlySelectedDateQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('from', formatISO(selectedDate));
    params.set('to', formatISO(endOfWeek(selectedDate, { weekStartsOn: 1 })));

    return params;
  }, [selectedDate]);

  const { data, error, mutate } =
    useSWR<InstructorDefaultAvailabilityResponseDTO>(
      `/api/default-availability?${currentlySelectedDateQueryParams}`,
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

    const apiEvents = data.availabilities.map(({ id, from, to, dayOfWeek }) => {
      if (editedEvent?.id === id) {
        return editedEvent;
      }

      const baseDate = getTodayWeek();
      const date = addDays(baseDate, dayOfWeek);

      return {
        id,
        start: set(date, from),
        end: set(date, to),
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
        <Flex marginBottom={24} alignItems="center" justifyContent="flex-end">
          <Button
            variant="outlined"
            component={Link}
            to=".."
            startIcon={<Icon>edit</Icon>}
          >
            Edytuj Dostępność
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
            eventColor={blue}
            formats={{
              dayFormat: formatDayOfWeek,
            }}
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
