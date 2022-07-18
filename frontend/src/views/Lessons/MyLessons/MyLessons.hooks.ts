import {
  GetMyLessonsResponseDTO,
  InstructorPublicAvailabilityResponseDTO,
  InstructorFindAllResponseDto,
} from '@osk/shared';
import { formatISO, endOfWeek, addDays, startOfWeek } from 'date-fns';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { LessonEvent } from './LessonsCalendar/LessonsCalendar.types';
import { getTodayWeek } from './MyLessons.utils';

interface UseFetchDataArguments {
  selectedDate: Date;
  selectedInstructorId: number | null;
  setSelectedInstructorId: (newSelectedInstructorId: number) => void;
}

export const useFetchData = ({
  selectedDate,
  selectedInstructorId,
  setSelectedInstructorId,
}: UseFetchDataArguments) => {
  const currentlySelectedDateQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('from', formatISO(selectedDate));
    params.set('to', formatISO(endOfWeek(selectedDate, { weekStartsOn: 1 })));

    return params;
  }, [selectedDate]);

  const getInstructorEventsDataUrl = () => {
    if (selectedInstructorId === null) {
      return undefined;
    }

    return `/api/availability/instructors/${selectedInstructorId}/public?${currentlySelectedDateQueryParams}`;
  };

  const {
    data: lessonsData,
    error: errorData,
    mutate: lessonsMutate,
  } = useSWR<GetMyLessonsResponseDTO>(
    `/api/lessons?${currentlySelectedDateQueryParams}`,
  );
  const {
    data: instructorEventsData,
    error: instructorsEventsError,
    mutate: instructorsEventsMutate,
  } = useSWR<InstructorPublicAvailabilityResponseDTO>(
    getInstructorEventsDataUrl(),
  );
  const { data: instructorsData, error: instructorsError } =
    useSWR<InstructorFindAllResponseDto>('/api/instructors', {
      onSuccess: (data) => {
        setSelectedInstructorId(data.instructors[0]?.id ?? -1);
      },
      revalidateOnFocus: false,
    });

  return {
    lessonsData,
    errorData,
    lessonsMutate,
    instructorEventsData,
    instructorsEventsError,
    instructorsEventsMutate,
    instructorsData,
    instructorsError,
  };
};

export const useSelectedDate = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayWeek());

  const onPrevWeekClick = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const onTodayClick = () => {
    setSelectedDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const onNextWeekClick = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  return {
    selectedDate,
    onPrevWeekClick,
    onTodayClick,
    onNextWeekClick,
  };
};

export const useEditModal = () => {
  const [editingEvent, setEditingEvent] = useState<LessonEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (eventToEdit: LessonEvent) => {
    setEditingEvent(eventToEdit);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  return {
    openEditModal,
    closeEditModal,
    editingEvent,
    isModalOpen,
  };
};
