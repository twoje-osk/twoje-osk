import { LessonStatus } from '@osk/shared/src/types/lesson.types';

export interface RequiredEvent {
  start: Date;
  end: Date;
}

export interface LessonEvent extends RequiredEvent {
  id?: number;
  status: LessonStatus;
  instructorId: number | null;
}

export interface LessonsCalendarProps {
  instructorEvents: RequiredEvent[];
  userEvents: LessonEvent[];
  createEvent: (event: LessonEvent) => void;
  selectedDate: Date;
  onLessonClick: (event: LessonEvent) => void;
  selectedInstructorId: number | null;
}

export type BackgroundEvent<T> = T & { type: 'background' };
export type FrontEvent<T> = T & { type: 'front'; title?: string };
