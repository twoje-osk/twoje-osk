import {
  GetMyLessonsResponseDTO,
  InstructorPublicAvailabilityResponseDTO,
} from '@osk/shared';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { startOfWeek } from 'date-fns';
import { assertNever } from '../../../utils/asserNever';
import {
  LessonEvent,
  RequiredEvent,
} from './LessonsCalendar/LessonsCalendar.types';

export function getTodayWeek() {
  return startOfWeek(new Date(), {
    weekStartsOn: 1,
  });
}

export const getInstructorEvents = (
  instructorEventsData: InstructorPublicAvailabilityResponseDTO | undefined,
): RequiredEvent[] => {
  const batches = instructorEventsData?.batches ?? [];

  return batches.map(({ from, to }) => ({
    start: new Date(from),
    end: new Date(to),
  }));
};

export const getUserEvents = (
  lessonsData: GetMyLessonsResponseDTO | undefined,
): LessonEvent[] => {
  const lessons = lessonsData?.lessons ?? [];
  return lessons.map(({ from, to, status, id }) => ({
    id,
    start: new Date(from),
    end: new Date(to),
    status,
  }));
};

export function getTranslatedLessonStatus(status: LessonStatus) {
  switch (status) {
    case LessonStatus.Accepted: {
      return 'Zaakceptowana';
    }
    case LessonStatus.Canceled: {
      return 'Anulowana';
    }
    case LessonStatus.Finished: {
      return 'Zakończona';
    }
    case LessonStatus.Requested: {
      return 'Oczekująca';
    }
    // no default
  }

  return assertNever(status);
}
