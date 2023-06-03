import {
  GetMyLessonsResponseDTO,
  InstructorPublicAvailabilityResponseDTO,
  InstructorFindAllResponseDto,
  CreateLessonForInstructorRequestDTO,
  CreateLessonForInstructorResponseDTO,
  UpdateLessonForInstructorRequestDTO,
  UpdateLessonForInstructorResponseDTO,
  CancelLessonForInstructorResponseDTO,
  AnnouncementFindAllQueryDto,
} from '@osk/shared';
import { formatISO, endOfWeek } from 'date-fns';
import { FormikHelpers } from 'formik';
import { Reducer, useMemo, useReducer } from 'react';
import useSWR from 'swr';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { LessonFormData } from './EditLessonForm/EditLessonForm.schema';
import { LessonEvent } from './LessonsCalendar/LessonsCalendar.types';
import { addQueryParams } from '../../../utils/addQueryParams';

interface UseFetchDataArguments {
  selectedDate: Date;
  selectedInstructorId: number | null;
  setSelectedInstructorId: (newSelectedInstructorId: number) => void;
  searchedPhrase: string | null;
  fetchDefault: boolean;
}

export const useFetchData = ({
  selectedDate,
  selectedInstructorId,
  setSelectedInstructorId,
  searchedPhrase,
  fetchDefault,
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
    `/api/trainee/lessons?${currentlySelectedDateQueryParams}`,
  );
  const {
    data: instructorEventsData,
    error: instructorsEventsError,
    mutate: instructorsEventsMutate,
  } = useSWR<InstructorPublicAvailabilityResponseDTO>(
    getInstructorEventsDataUrl(),
  );
  console.log('============================================');
  const instructorsUrl =
    fetchDefault || searchedPhrase === null || searchedPhrase === ''
      ? addQueryParams<AnnouncementFindAllQueryDto>('/api/instructors', {
          page: 0,
          pageSize: 1,
        })
      : addQueryParams('/api/instructors', {
          filters: { searchedPhrase },
        });
  const { data: instructorsData, error: instructorsError } =
    useSWR<InstructorFindAllResponseDto>(instructorsUrl, {
      onSuccess: (data) => {
        if (
          selectedInstructorId === null &&
          (searchedPhrase === null || searchedPhrase === '')
        ) {
          setSelectedInstructorId(data.instructors[0]?.id ?? -1);
        }
      },
      revalidateOnFocus: false,
    });
  console.log(
    'fetched',
    instructorsData?.instructors.length,
    'records from',
    instructorsUrl,
  );

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

type MyLessonsModalStore =
  | {
      isModalOpen: true;
      isCreating: boolean;
      event: LessonEvent;
      isLoading: boolean;
      isCanceling: boolean;
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
      type: 'cancelStart';
    }
  | {
      type: 'submit';
    }
  | {
      type: 'error';
    };

interface MyLessonsModalArguments {
  mutate: () => Promise<unknown>;
  instructorId: number | null;
  traineeId: number | null;
}

export const useMyLessonsModal = ({
  mutate,
  instructorId,
  traineeId,
}: MyLessonsModalArguments) => {
  const makeRequestWithAuth = useMakeRequestWithAuth();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
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
          isCanceling: false,
        };
      }

      if (action.type === 'cancelStart') {
        return {
          ...prevStore,
          isLoading: false,
          isCanceling: true,
        };
      }

      if (action.type === 'error') {
        return {
          ...prevStore,
          isCanceling: false,
          isLoading: false,
        };
      }

      return {
        isModalOpen: true,
        event: action.event,
        isCreating: action.type === 'create',
        isLoading: false,
        isCanceling: false,
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

  const openCreateModal = (
    eventToCreate: Omit<LessonEvent, 'instructorId' | 'traineeId'>,
  ) => {
    dispatch({
      type: 'create',
      event: {
        ...eventToCreate,
        instructorId,
        traineeId,
      },
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
    };

    dispatch({ type: 'submit' });

    const response = await makeRequestWithAuth<
      CreateLessonForInstructorResponseDTO,
      CreateLessonForInstructorRequestDTO
    >(`/api/trainee/lessons/instructor/${instructorId}`, 'POST', body);

    if (!response.ok) {
      dispatch({ type: 'error' });
      showErrorSnackbar();
      return;
    }

    await mutate();
    showSuccessSnackbar('Lekcja została dodana');

    dispatch({ type: 'close' });
  };

  const onEditSubmit = async (
    event: LessonEvent,
    helpers: FormikHelpers<LessonFormData>,
  ) => {
    if (!store.isModalOpen) {
      return;
    }

    if (store.event.id === undefined) {
      return;
    }

    const body: UpdateLessonForInstructorRequestDTO = {
      from: formatISO(event.start),
      to: formatISO(event.end),
    };

    dispatch({ type: 'submit' });

    const response = await makeRequestWithAuth<
      UpdateLessonForInstructorResponseDTO,
      UpdateLessonForInstructorRequestDTO
    >(`/api/trainee/lessons/${store.event.id}`, 'PATCH', body);

    if (!response.ok && response.error.status === 409) {
      dispatch({ type: 'error' });
      helpers.setFieldError(
        'date',
        'Instruktor w podanym terminie jest zajęty',
      );
      return;
    }

    if (!response.ok) {
      dispatch({ type: 'error' });
      showErrorSnackbar();
      return;
    }

    await mutate();

    showSuccessSnackbar('Lekcja została zmodyfikowana');
    dispatch({ type: 'close' });
  };

  const onSubmit = (
    event: LessonEvent,
    helpers: FormikHelpers<LessonFormData>,
  ) => {
    if (!store.isModalOpen) {
      return;
    }

    if (store.isCreating) {
      onCreateSubmit(event);
      return;
    }

    onEditSubmit(event, helpers);
  };

  const onLessonCancel = async () => {
    if (!store.isModalOpen) {
      return;
    }

    if (store.event.id === undefined) {
      return;
    }

    dispatch({ type: 'cancelStart' });

    const response =
      await makeRequestWithAuth<CancelLessonForInstructorResponseDTO>(
        `/api/trainee/lessons/${store.event.id}/cancel`,
        'PATCH',
      );

    if (!response.ok) {
      dispatch({ type: 'error' });
      showErrorSnackbar();
      return;
    }

    await mutate();
    showSuccessSnackbar('Lekcja została anulowana');

    dispatch({ type: 'close' });
  };

  return {
    openEditModal,
    closeEditModal,
    openCreateModal,
    onLessonCancel,
    onSubmit,
    state: store,
  };
};
