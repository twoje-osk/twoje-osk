import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { SlotInfo } from 'react-big-calendar';

export interface RequiredEvent {
  start: Date;
  end: Date;
}

export interface LessonEvent extends RequiredEvent {
  id?: number;
  status: LessonStatus;
  instructorId: number | null;
  traineeId: number | null;
}

export interface LessonsCalendarProps {
  instructorEvents: RequiredEvent[];
  userEvents: LessonEvent[];
  createEvent: (event: Omit<LessonEvent, 'instructorId' | 'traineeId'>) => void;
  selectedDate: Date;
  onLessonClick: (event: LessonEvent) => void;
  canCreateEvent: (slotInfo: SlotInfo) => boolean;
  allowCreationOnlyAfterToday?: boolean;
}

export type BackgroundEvent<T> = T & { type: 'background' };
export type FrontEvent<T> = T & { type: 'front'; title?: string };
