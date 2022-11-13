import {
  InstructorCreateAvailabilityRequestDTO,
  InstructorCreateAvailabilityResponseDTO,
  InstructorUpdateAvailabilityRequestDTO,
  InstructorUpdateAvailabilityResponseDTO,
} from '@osk/shared';
import { useState } from 'react';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { AvailabilityEvent } from './AvailabilityCalendar/AvailabilityCalendar.types';

interface Arguments {
  mutate: () => Promise<unknown>;
}

export const useEditEvent = ({ mutate }: Arguments) => {
  const [addedEvent, setAddedEvent] = useState<AvailabilityEvent | null>(null);
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

  return { onEventUpdate, onEventCreate, addedEvent, editedEvent };
};
