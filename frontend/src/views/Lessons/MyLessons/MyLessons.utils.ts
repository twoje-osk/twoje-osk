import {
  GetMyLessonsResponseDTO,
  InstructorPublicAvailabilityResponseDTO,
} from '@osk/shared';
import { startOfWeek } from 'date-fns';
import { RequiredEvent } from '../../../components/LessonsCalendar/LessonsCalendar';

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
): RequiredEvent[] => {
  const lessons = lessonsData?.lessons ?? [];
  return lessons.map(({ from, to }) => ({
    start: new Date(from),
    end: new Date(to),
  }));
};
