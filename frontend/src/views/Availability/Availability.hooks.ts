import {
  InstructorCreateAvailabilityRequestDTO,
  InstructorCreateAvailabilityResponseDTO,
  InstructorDeleteAvailabilityResponseDTO,
  InstructorUpdateAvailabilityRequestDTO,
  InstructorUpdateAvailabilityResponseDTO,
} from '@osk/shared';
import { useState } from 'react';
import { useActionModal } from '../../hooks/useActionModal/useActionModal';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { AvailabilityEvent } from './AvailabilityCalendar/AvailabilityCalendar.types';

interface UseEditEventArguments {
  mutate: () => Promise<unknown>;
}

export const useEditEvent = ({ mutate }: UseEditEventArguments) => {
  const [editedEvent, setEditedEvent] = useState<AvailabilityEvent | null>(
    null,
  );
  const { showSuccessSnackbar, showErrorSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const onEventUpdate = async (newEvent: AvailabilityEvent) => {
    setEditedEvent({
      id: newEvent.id,
      start: newEvent.start,
      end: newEvent.end,
    });

    const response = await makeRequest<
      InstructorUpdateAvailabilityResponseDTO,
      InstructorUpdateAvailabilityRequestDTO
    >(`/api/availability/${newEvent.id}`, 'PATCH', {
      availability: {
        from: newEvent.start.toISOString(),
        to: newEvent.end.toISOString(),
      },
    });

    if (!response.ok) {
      showErrorSnackbar();
      setEditedEvent(null);
      return;
    }

    await mutate();
    setEditedEvent(null);
    showSuccessSnackbar('Dostępność została zmieniona');
  };

  return {
    onEventUpdate,
    editedEvent,
  };
};

interface UseCreateEventArguments {
  mutate: () => Promise<unknown>;
}

export const useCreateEvent = ({ mutate }: UseCreateEventArguments) => {
  const [addedEvent, setAddedEvent] = useState<AvailabilityEvent | null>(null);
  const { showSuccessSnackbar, showErrorSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const onEventCreate = async (newEvent: Omit<AvailabilityEvent, 'id'>) => {
    setAddedEvent({
      id: -1,
      start: newEvent.start,
      end: newEvent.end,
    });

    const response = await makeRequest<
      InstructorCreateAvailabilityResponseDTO,
      InstructorCreateAvailabilityRequestDTO
    >(`/api/availability`, 'POST', {
      availability: {
        from: newEvent.start.toISOString(),
        to: newEvent.end.toISOString(),
      },
    });

    if (!response.ok) {
      showErrorSnackbar();
      setAddedEvent(null);
      return;
    }

    await mutate();
    setAddedEvent(null);
    showSuccessSnackbar('Dostępność została dodana');
  };

  return {
    onEventCreate,
    addedEvent,
  };
};

interface UseDeleteEventArguments {
  mutate: () => Promise<unknown>;
}

export const useDeleteEvent = ({ mutate }: UseDeleteEventArguments) => {
  const [deletedEvent, setDeletedEvent] = useState<AvailabilityEvent | null>(
    null,
  );
  const { showSuccessSnackbar, showErrorSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const {
    setLoading: setDeleteModalLoading,
    isLoading: isDeleteModalLoading,
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useActionModal();

  const onDeleteClick = (eventToBeDeleted: AvailabilityEvent) => {
    setDeletedEvent(eventToBeDeleted);
    openDeleteModal();
  };

  const onEventDelete = async () => {
    if (deletedEvent === null) {
      return;
    }

    setDeleteModalLoading(true);
    const response = await makeRequest<InstructorDeleteAvailabilityResponseDTO>(
      `/api/availability/${deletedEvent.id}`,
      'DELETE',
    );

    if (!response.ok) {
      showErrorSnackbar();
      setDeletedEvent(null);
      return;
    }

    await mutate();
    setDeletedEvent(null);
    setDeleteModalLoading(false);
    showSuccessSnackbar('Dostępność została usunięta');
    closeDeleteModal();
  };

  return {
    onEventDelete,
    isDeleteModalLoading,
    isDeleteModalOpen,
    closeDeleteModal,
    onDeleteClick,
  };
};
