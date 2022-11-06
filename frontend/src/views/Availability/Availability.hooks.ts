import { useState } from 'react';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { sleep } from '../../utils/sleep';
import { AvailabilityEvent } from './AvailabilityCalendar/AvailabilityCalendar.types';

interface Arguments {
  mutate: () => Promise<unknown>;
}

export const useEditEvent = ({ mutate }: Arguments) => {
  const [addedEvent, setAddedEvent] = useState<AvailabilityEvent | null>(null);
  const [editedEvent, setEditedEvent] = useState<AvailabilityEvent | null>(
    null,
  );
  const { showSuccessSnackbar } = useCommonSnackbars();

  const onEventUpdate = async (newEvent: AvailabilityEvent) => {
    console.log(newEvent);

    setEditedEvent({
      id: newEvent.id,
      start: newEvent.start,
      end: newEvent.end,
    });

    await sleep(1500);

    await mutate();
    setEditedEvent(null);
    showSuccessSnackbar('Dostępność została zmieniona');
  };

  const onEventCreate = async (newEvent: Omit<AvailabilityEvent, 'id'>) => {
    console.log(newEvent);

    setAddedEvent({
      id: -1,
      start: newEvent.start,
      end: newEvent.end,
    });

    await sleep(1500);

    await mutate();
    setAddedEvent(null);
    showSuccessSnackbar('Dostępność została dodana');
  };

  return { onEventUpdate, onEventCreate, addedEvent, editedEvent };
};
