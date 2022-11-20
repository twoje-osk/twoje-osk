import {
  ButtonGroup,
  Icon,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { GetMyLessonsResponseDTO } from '@osk/shared';
import { formatISO, endOfWeek } from 'date-fns';
import { useMemo, useState } from 'react';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { useMyLessonsModal } from './InstructorMyLessons.hooks';
import {
  CalendarWrapper,
  FullPageRelativeWrapper,
  GroupedIconButton,
  LoaderOverlay,
} from '../MyLessons/MyLessons.styled';
import { LessonsCalendar } from '../TraineeMyLessons/LessonsCalendar/LessonsCalendar';
import { getUserEvents } from '../TraineeMyLessons/TraineeMyLessons.utils';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { EditLessonModal } from '../TraineeMyLessons/EditLessonModal/EditLessonModal';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { useSelectedDate } from '../../../hooks/useSelectedDate/useSelectedDate';

export const InstructorMyLessons = () => {
  const { user } = useAuth();
  const instructorId = user?.instructor?.id!;

  const [showCancelled, setShowCancelled] = useState(false);
  const { selectedDate, onPrevWeekClick, onTodayClick, onNextWeekClick } =
    useSelectedDate();

  const currentlySelectedDateQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('from', formatISO(selectedDate));
    params.set('to', formatISO(endOfWeek(selectedDate, { weekStartsOn: 1 })));

    return params;
  }, [selectedDate]);

  const {
    data: lessonsData,
    error: errorData,
    mutate,
  } = useSWR<GetMyLessonsResponseDTO>(
    `/api/instructor/lessons?${currentlySelectedDateQueryParams}`,
  );

  const userEvents = useMemo(() => {
    const lessons = lessonsData?.lessons ?? [];
    const filteredLessons = showCancelled
      ? lessons
      : lessons.filter((lesson) => lesson.status !== LessonStatus.Canceled);
    return getUserEvents(filteredLessons);
  }, [lessonsData?.lessons, showCancelled]);

  const {
    closeEditModal,
    openEditModal,
    state: modalState,
    openCreateModal,
    onSubmit,
    onLessonCancel,
  } = useMyLessonsModal({
    mutate,
    instructorId,
  });

  if (errorData) {
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
        <FormControlLabel
          control={
            <Checkbox
              checked={showCancelled}
              onChange={(e) => setShowCancelled(e.target.checked)}
            />
          }
          label="Pokaż anulowane"
        />
      </Flex>
      <CalendarWrapper>
        <LessonsCalendar
          instructorEvents={[]}
          userEvents={
            modalState.isModalOpen && modalState.isCreating
              ? [...userEvents, modalState.event]
              : userEvents
          }
          createEvent={openCreateModal}
          selectedDate={selectedDate}
          onLessonClick={openEditModal}
          canCreateEvent={() => true}
        />
        {lessonsData === undefined && (
          <LoaderOverlay>
            <CircularProgress />
          </LoaderOverlay>
        )}
      </CalendarWrapper>
      <EditLessonModal
        isOpen={modalState.isModalOpen}
        event={modalState.isModalOpen ? modalState.event : null}
        onClose={closeEditModal}
        isCreating={modalState.isModalOpen ? modalState.isCreating : false}
        onSubmit={onSubmit}
        isLoading={modalState.isModalOpen ? modalState.isLoading : false}
        onLessonCancel={onLessonCancel}
        isCanceling={modalState.isModalOpen ? modalState.isCanceling : false}
      />
    </FullPageRelativeWrapper>
  );
};
