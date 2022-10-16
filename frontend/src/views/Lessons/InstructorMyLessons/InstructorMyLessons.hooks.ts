import {
  CancelLessonForInstructorResponseDTO,
  UpdateLessonResponseDTO,
  UpdateLessonRequestDTO,
  CreateLessonRequestDTO,
  CreateLessonResponseDTO,
} from '@osk/shared';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { formatISO } from 'date-fns';
import { Reducer, useReducer } from 'react';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { LessonEvent } from '../TraineeMyLessons/LessonsCalendar/LessonsCalendar.types';

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
}

export const useMyLessonsModal = ({
  mutate,
  instructorId,
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
        status: LessonStatus.Accepted,
        instructorId,
        traineeId: null,
      },
    });
  };

  const closeEditModal = () => {
    dispatch({
      type: 'close',
    });
  };

  const onCreateSubmit = async (event: LessonEvent) => {
    if (event.traineeId === null) {
      dispatch({ type: 'error' });
      showErrorSnackbar();
      return;
    }

    const body: CreateLessonRequestDTO = {
      from: formatISO(event.start),
      to: formatISO(event.end),
      status: event.status,
      traineeId: event.traineeId,
    };

    dispatch({ type: 'submit' });

    const response = await makeRequestWithAuth<
      CreateLessonResponseDTO,
      CreateLessonRequestDTO
    >(`/api/instructor/lessons`, 'POST', body);

    if (!response.ok) {
      dispatch({ type: 'error' });
      showErrorSnackbar();
      return;
    }

    await mutate();
    showSuccessSnackbar('Lekcja została dodana');

    dispatch({ type: 'close' });
  };

  const onEditSubmit = async (event: LessonEvent) => {
    if (!store.isModalOpen) {
      return;
    }

    if (store.event.id === undefined) {
      return;
    }

    const body: UpdateLessonRequestDTO = {
      from: formatISO(event.start),
      to: formatISO(event.end),
      status: event.status,
    };

    dispatch({ type: 'submit' });

    const response = await makeRequestWithAuth<
      UpdateLessonResponseDTO,
      UpdateLessonRequestDTO
    >(`/api/instructor/lessons/${store.event.id}`, 'PUT', body);

    if (!response.ok) {
      dispatch({ type: 'error' });
      showErrorSnackbar();
      return;
    }

    await mutate();

    showSuccessSnackbar('Lekcja została zmodyfikowana');
    dispatch({ type: 'close' });
  };

  const onSubmit = (event: LessonEvent) => {
    if (!store.isModalOpen) {
      return;
    }

    if (store.isCreating) {
      onCreateSubmit(event);
      return;
    }

    onEditSubmit(event);
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
