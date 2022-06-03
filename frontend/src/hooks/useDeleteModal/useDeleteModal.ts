import { useState } from 'react';

type State = 'closed' | 'open' | 'loading';

export const useDeleteModal = () => {
  const [state, setState] = useState<State>('closed');
  const setLoading = (isLoading: boolean) =>
    setState(isLoading ? 'loading' : 'open');
  const setOpen = (isOpen: boolean) => setState(isOpen ? 'open' : 'closed');
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const isLoading = state === 'loading';
  const isOpen = state === 'open' || isLoading;

  return {
    setLoading,
    setOpen,
    isLoading,
    isOpen,
    openModal,
    closeModal,
  };
};
