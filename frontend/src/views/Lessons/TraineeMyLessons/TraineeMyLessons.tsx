import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Flex } from 'reflexbox';
import { GetLessonByIdResponseDTO } from '@osk/shared';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '../../../components/Accordion/Accordion';
import { InstructorsForm } from '../../Instructors/InstructorsForm/InstructorsForm';
import { InstructorsFormData } from '../../Instructors/InstructorsForm/InstructorsForm.schema';

export const TraineeMyLessons = () => {
  const auth = useAuth();
  const traineeId = auth.user?.trainee?.id!;
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    number | null
  >(null);

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
  });

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

  if (instructorsData === undefined) {
    return <FullPageLoading />;
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
        <Box width={320}>
          <FormControl fullWidth>
            <InputLabel id="instructor-label">Instruktor</InputLabel>
            <Select<number | null>
              labelId="instructor-label"
              id="instructor"
              value={selectedInstructorId}
              label="Instruktor"
              onChange={(e) => {
                const { value } = e.target;
                if (typeof value === 'string') {
                  return;
                }

                setSelectedInstructorId(value);
              }}
            >
              {instructorsData.instructors.map(({ id, user }) => (
                <MenuItem value={id} key={id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
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
        instructorDetails={
          modalState.isModalOpen &&
          modalState.event.id != null && (
            <Box pb="16px">
              <Accordion>
                <AccordionSummary
                  expandIcon={<Icon>expand_more</Icon>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Dane Instruktora
                </AccordionSummary>
                <AccordionDetails>
                  <InstructorDetails lessonId={modalState.event.id} />
                </AccordionDetails>
              </Accordion>
            </Box>
          )
        }
      />
    </FullPageRelativeWrapper>
  );
};

interface InstructorDetailsProps {
  lessonId: number;
}
const InstructorDetails = ({ lessonId }: InstructorDetailsProps) => {
  const { data: lessonData, error: lessonError } =
    useSWR<GetLessonByIdResponseDTO>(`/api/trainee/lessons/${lessonId}`);

  if (lessonError) {
    return <GeneralAPIError />;
  }

  if (lessonData === undefined) {
    return <FullPageLoading />;
  }

  const { instructor } = lessonData.lesson;
  const initialValues: InstructorsFormData = {
    firstName: instructor.user.firstName,
    lastName: instructor.user.lastName,
    email: instructor.user.email,
    licenseNumber: instructor.licenseNumber,
    registrationNumber: instructor.registrationNumber,
    instructorsQualificationsIds: instructor.instructorsQualificationsIds,
    phoneNumber: instructor.user.phoneNumber,
  };

  return <InstructorsForm hideImage initialValues={initialValues} disabled />;
};
