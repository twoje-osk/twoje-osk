import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import {
  CreateLessonForInstructorRequestDTO,
  CreateLessonForInstructorResponseDTO,
  GetMyLessonsResponseDTO,
  InstructorPublicAvailabilityResponseDTO,
} from '@osk/shared';
import { formatISO } from 'date-fns';
import { useState } from 'react';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import {
  LessonsCalendar,
  RequiredEvent,
} from '../../../components/LessonsCalendar/LessonsCalendar';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';

export const MyLessons = () => {
  const {
    data: lessonsData,
    error: errorData,
    mutate: lessonsMutate,
  } = useSWR<GetMyLessonsResponseDTO>('/api/lessons');
  const {
    data: instructorsData,
    error: instructorsError,
    mutate: instructorsMutate,
  } = useSWR<InstructorPublicAvailabilityResponseDTO>(
    '/api/availability/instructors/1/public',
  );
  const makeRequestWithAuth = useMakeRequestWithAuth();
  const { showErrorSnackbar } = useCommonSnackbars();
  const [isMutationLoading, setIsMutationLoading] = useState(false);

  if (errorData || instructorsError) {
    return <GeneralAPIError />;
  }

  if (lessonsData === undefined || instructorsData === undefined) {
    return <FullPageLoading />;
  }

  const instructorEvents: RequiredEvent[] = instructorsData.batches.map(
    ({ from, to }) => ({
      start: new Date(from),
      end: new Date(to),
    }),
  );

  const userEvents: RequiredEvent[] = lessonsData.lessons.map(
    ({ from, to }) => ({
      start: new Date(from),
      end: new Date(to),
    }),
  );

  const createEvent = async (event: RequiredEvent) => {
    const body: CreateLessonForInstructorRequestDTO = {
      from: formatISO(event.start),
      to: formatISO(event.end),
      vehicleId: 1,
    };

    setIsMutationLoading(true);
    const response = await makeRequestWithAuth<
      CreateLessonForInstructorResponseDTO,
      CreateLessonForInstructorRequestDTO
    >('/api/lessons/instructor/1', 'POST', body);

    if (!response.ok) {
      setIsMutationLoading(false);
      showErrorSnackbar();
      return;
    }

    await Promise.all([lessonsMutate(), instructorsMutate()]);

    setIsMutationLoading(false);
  };

  return (
    <FullPageRelativeWrapper>
      <LessonsCalendar
        instructorEvents={instructorEvents}
        userEvents={userEvents}
        createEvent={createEvent}
      />
      {isMutationLoading && (
        <LoaderOverlay>
          <CircularProgress />
        </LoaderOverlay>
      )}
    </FullPageRelativeWrapper>
  );
};

const FullPageRelativeWrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 32px;
`;

const LoaderOverlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
`;
