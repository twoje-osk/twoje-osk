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
import {
  CreateLessonForInstructorRequestDTO,
  CreateLessonForInstructorResponseDTO,
} from '@osk/shared';
import { formatISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { Flex } from 'reflexbox';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { LessonsCalendar } from './LessonsCalendar/LessonsCalendar';
import { RequiredEvent } from './LessonsCalendar/LessonsCalendar.types';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { EditLessonModal } from './EditLessonModal/EditLessonModal';
import { useEditModal, useFetchData, useSelectedDate } from './MyLessons.hooks';
import {
  FullPageRelativeWrapper,
  GroupedIconButton,
  CalendarWrapper,
  LoaderOverlay,
} from './MyLessons.styled';
import { getInstructorEvents, getUserEvents } from './MyLessons.utils';

export const MyLessons = () => {
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    number | null
  >(null);

  const { selectedDate, onPrevWeekClick, onTodayClick, onNextWeekClick } =
    useSelectedDate();

  const {
    lessonsData,
    errorData,
    lessonsMutate,
    instructorEventsData,
    instructorsEventsError,
    instructorsEventsMutate,
    instructorsData,
    instructorsError,
  } = useFetchData({
    selectedDate,
    selectedInstructorId,
    setSelectedInstructorId,
  });

  const { isModalOpen, editingEvent, closeEditModal, openEditModal } =
    useEditModal();

  const makeRequestWithAuth = useMakeRequestWithAuth();
  const { showErrorSnackbar } = useCommonSnackbars();
  const [isMutationLoading, setIsMutationLoading] = useState(false);

  const instructorEvents = useMemo(
    () => getInstructorEvents(instructorEventsData),
    [instructorEventsData],
  );

  const userEvents = useMemo(() => getUserEvents(lessonsData), [lessonsData]);

  if (errorData || instructorsEventsError || instructorsError) {
    return <GeneralAPIError />;
  }

  if (instructorsData === undefined) {
    return <FullPageLoading />;
  }

  const createEvent = async (event: RequiredEvent) => {
    const body: CreateLessonForInstructorRequestDTO = {
      from: formatISO(event.start),
      to: formatISO(event.end),
      vehicleId: null,
    };

    setIsMutationLoading(true);
    const response = await makeRequestWithAuth<
      CreateLessonForInstructorResponseDTO,
      CreateLessonForInstructorRequestDTO
    >(`/api/lessons/instructor/${selectedInstructorId}`, 'POST', body);

    if (!response.ok) {
      setIsMutationLoading(false);
      showErrorSnackbar();
      return;
    }

    await Promise.all([lessonsMutate(), instructorsEventsMutate()]);

    setIsMutationLoading(false);
  };

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
            <Select
              labelId="instructor-label"
              id="instructor"
              value={selectedInstructorId}
              label="Instruktor"
              onChange={(e) =>
                setSelectedInstructorId(e.target.value as number)
              }
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
          userEvents={userEvents}
          createEvent={createEvent}
          selectedDate={selectedDate}
          onLessonClick={openEditModal}
        />
        {(isMutationLoading ||
          instructorEventsData === undefined ||
          lessonsData === undefined) && (
          <LoaderOverlay>
            <CircularProgress />
          </LoaderOverlay>
        )}
      </CalendarWrapper>
      <EditLessonModal
        isOpen={isModalOpen}
        event={editingEvent}
        onClose={closeEditModal}
      />
    </FullPageRelativeWrapper>
  );
};
