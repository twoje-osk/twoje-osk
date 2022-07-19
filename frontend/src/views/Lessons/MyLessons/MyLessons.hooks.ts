import {
  GetMyLessonsResponseDTO,
  InstructorPublicAvailabilityResponseDTO,
  InstructorFindAllResponseDto,
  CreateLessonForInstructorRequestDTO,
  CreateLessonForInstructorResponseDTO,
} from '@osk/shared';
import { formatISO, endOfWeek, addDays, startOfWeek } from 'date-fns';
import { Reducer, useMemo, useReducer, useState } from 'react';
import useSWR from 'swr';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
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

  const mutate = () =>
    Promise.all([lessonsMutate(), instructorsEventsMutate()]);

  return {
    mutate,
    lessonsData,
    errorData,
    instructorEventsData,
    instructorsEventsError,
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

type MyLessonsModalStore =
  | {
      isModalOpen: true;
      isCreating: boolean;
      event: LessonEvent;
      isLoading: boolean;
    }
  | {
      isModalOpen: false;
    };

type MyLessonsModalAction =
  | {
      type: 'close';
    }
  | {
      type: 'edit' | 'create';
      event: LessonEvent;
    }
  | {
      type: 'submit';
    }
  | {
      type: 'error';
    };

interface MyLessonsModalArguments {
  mutate: () => Promise<unknown>;
  selectedInstructorId: number | null;
}

export const useMyLessonsModal = ({
  mutate,
  selectedInstructorId,
}: MyLessonsModalArguments) => {
  const makeRequestWithAuth = useMakeRequestWithAuth();
  const { showErrorSnackbar } = useCommonSnackbars();
  const [store, dispatch] = useReducer<
    Reducer<MyLessonsModalStore, MyLessonsModalAction>
  >(
    (prevStore, action) => {
      if (action.type === 'close') {
        return {
          isModalOpen: false,
        };
      }

      if (action.type === 'submit') {
        return {
          ...prevStore,
          isLoading: true,
        };
      }

      if (action.type === 'error') {
        return {
          ...prevStore,
          isLoading: false,
        };
      }

      return {
        isModalOpen: true,
        event: action.event,
        isCreating: action.type === 'create',
        isLoading: false,
      };
    },
    {
      isModalOpen: false,
    },
  );

  const openEditModal = (eventToEdit: LessonEvent) => {
    dispatch({
      type: 'edit',
      event: eventToEdit,
    });
  };

  const openCreateModal = (eventToCreate: LessonEvent) => {
    dispatch({
      type: 'create',
      event: eventToCreate,
    });
  };

  const closeEditModal = () => {
    dispatch({
      type: 'close',
    });
  };

  const onCreateSubmit = async (event: LessonEvent) => {
    const body: CreateLessonForInstructorRequestDTO = {
      from: formatISO(event.start),
      to: formatISO(event.end),
      vehicleId: null,
    };

    dispatch({ type: 'submit' });

    const response = await makeRequestWithAuth<
      CreateLessonForInstructorResponseDTO,
      CreateLessonForInstructorRequestDTO
    >(`/api/lessons/instructor/${selectedInstructorId}`, 'POST', body);

    if (!response.ok) {
      dispatch({ type: 'error' });
      showErrorSnackbar();
      return;
    }

    await mutate();

    dispatch({ type: 'close' });
  };

  const onSubmit = (event: LessonEvent) => {
    onCreateSubmit(event);
  };

  return {
    openEditModal,
    closeEditModal,
    openCreateModal,
    onSubmit,
    state: store,
  };
};
