import { UpdateLessonRequestDTO, UpdateLessonResponseDTO } from '@osk/shared';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { formatISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useCommonSnackbars } from '../../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { LessonEvent } from '../../TraineeMyLessons/LessonsCalendar/LessonsCalendar.types';

export const useCancelLesson = (
  lessonEvent: LessonEvent | undefined,
  onLessonCancelFinished: () => void,
) => {
  const [lessonCancelState, setLessonCancelState] = useState<
    'idle' | 'done' | 'error' | 'loading'
  >('idle');
  const makeRequestWithAuth = useMakeRequestWithAuth();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  useEffect(() => {
    setLessonCancelState('idle');
  }, [lessonEvent]);

  const onLessonCancel = async () => {
    if (lessonEvent === undefined) {
      return;
    }

    setLessonCancelState('loading');

    const body: UpdateLessonRequestDTO = {
      from: formatISO(lessonEvent.start),
      to: formatISO(lessonEvent.end),
      status: LessonStatus.Canceled,
    };

    const response = await makeRequestWithAuth<
      UpdateLessonResponseDTO,
      UpdateLessonRequestDTO
    >(`/api/instructor/lessons/${lessonEvent.id}`, 'PUT', body);

    if (!response.ok) {
      setLessonCancelState('error');
      showErrorSnackbar();
      return;
    }

    showSuccessSnackbar('Lekcja została anulowana');
    setLessonCancelState('done');
    onLessonCancelFinished();
  };

  return {
    lessonCancelState,
    onLessonCancel,
  };
};
