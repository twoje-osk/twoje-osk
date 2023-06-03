import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  Icon,
} from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { Flex } from 'reflexbox';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { LessonsCalendar } from './LessonsCalendar/LessonsCalendar';
import { EditLessonModal } from './EditLessonModal/EditLessonModal';
import { useMyLessonsModal, useFetchData } from './TraineeMyLessons.hooks';
import {
  FullPageRelativeWrapper,
  GroupedIconButton,
  CalendarWrapper,
  LoaderOverlay,
} from '../MyLessons/MyLessons.styled';
import { getInstructorEvents, getUserEvents } from './TraineeMyLessons.utils';
import { isRangeAvailable } from './LessonsCalendar/LessonsCalendar.utils';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { useSelectedDate } from '../../../hooks/useSelectedDate/useSelectedDate';
import { InstructorsAutocomplete } from '../../../components/InstructorsAutocomplete/InstructorsAutocomplete';

export const TraineeMyLessons = () => {
  const auth = useAuth();
  const traineeId = auth.user?.trainee?.id!;
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    number | null
  >(null);
  const [instructorsSearchValue, setInstructorsSearchValue] =
    useState<string>('');
  const fetchDefaultInstructor = useRef<boolean>(true);
  const { selectedDate, onPrevWeekClick, onTodayClick, onNextWeekClick } =
    useSelectedDate();

  const {
    lessonsData,
    errorData,
    mutate,
    instructorEventsData,
    instructorsEventsError,
    instructorsData,
    instructorsError,
  } = useFetchData({
    selectedDate,
    selectedInstructorId,
    setSelectedInstructorId,
    searchedPhrase: instructorsSearchValue,
    fetchDefault: fetchDefaultInstructor.current,
  });
  const instructorsOptions = instructorsData
    ? instructorsData?.instructors?.map((instructor) => {
        return {
          label: `${instructor.user.firstName} ${instructor.user.lastName} (tel: ${instructor.user.phoneNumber})`,
          id: instructor.id,
        };
      }) ?? []
    : [];
  fetchDefaultInstructor.current = false;
  const {
    closeEditModal,
    openEditModal,
    state: modalState,
    openCreateModal,
    onSubmit,
    onLessonCancel,
  } = useMyLessonsModal({
    mutate,
    instructorId: selectedInstructorId,
    traineeId,
  });

  const instructorEvents = useMemo(
    () => getInstructorEvents(instructorEventsData),
    [instructorEventsData],
  );

  const userEvents = useMemo(
    () => getUserEvents(lessonsData?.lessons ?? []),
    [lessonsData],
  );

  if (errorData || instructorsEventsError || instructorsError) {
    return <GeneralAPIError />;
  }

  const isInputLoading = instructorsData === undefined;

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
        <Box width={320}>
          <FormControl fullWidth>
            <InstructorsAutocomplete
              options={instructorsOptions}
              handleInputChange={setInstructorsSearchValue}
              setSelectedInstructorId={setSelectedInstructorId}
              selectedInstructorId={selectedInstructorId}
              isLoading={isInputLoading}
              onBlur={() => {
                fetchDefaultInstructor.current = selectedInstructorId === null;
                setInstructorsSearchValue('');
              }}
            />
          </FormControl>
        </Box>
      </Flex>
      <CalendarWrapper>
        <LessonsCalendar
          instructorEvents={instructorEvents}
          userEvents={
            modalState.isModalOpen && modalState.isCreating
              ? [...userEvents, modalState.event]
              : userEvents
          }
          createEvent={openCreateModal}
          selectedDate={selectedDate}
          onLessonClick={openEditModal}
          canCreateEvent={(slotInfo) =>
            isRangeAvailable(slotInfo, instructorEvents)
          }
          allowCreationOnlyAfterToday
        />
        {(instructorEventsData === undefined || lessonsData === undefined) && (
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
