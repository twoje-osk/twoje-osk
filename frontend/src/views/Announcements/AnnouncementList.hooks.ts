import {
  AnnouncementCreateRequestDto,
  AnnouncementCreateResponseDto,
  AnnouncementDeleteResponseDto,
  AnnouncementUpdateRequestDto,
  AnnouncementUpdateResponseDto,
  AnnouncementDto,
} from '@osk/shared';
import { useState } from 'react';
import { useActionModal } from '../../hooks/useActionModal/useActionModal';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { AnnouncementFormSchema } from './AnnouncementFormModal/AnnouncementFormModal.schema';

interface AnnouncementHooksArguments {
  mutate: () => Promise<unknown>;
}

export const useCreateAnouncement = ({
  mutate,
}: AnnouncementHooksArguments) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const createAnnouncement = async (values: AnnouncementFormSchema) => {
    const { subject, body } = values;
    const announcement: AnnouncementCreateRequestDto = {
      announcement: {
        subject,
        body,
      },
    };
    const announcementApiUrl = '/api/announcements';
    const response = await makeRequest<
      AnnouncementCreateResponseDto,
      AnnouncementCreateRequestDto
    >(announcementApiUrl, 'POST', announcement);
    if (!response.ok) {
      showErrorSnackbar();
      return;
    }
    await mutate();
    showSuccessSnackbar('Ogłoszenie zostało utworzone');
    setIsCreateModalOpen(false);
  };

  return {
    openCreateModal,
    closeCreateModal,
    isCreateModalOpen,
    createAnnouncement,
  };
};

export const useEditAnnouncement = ({ mutate }: AnnouncementHooksArguments) => {
  const [announcementToBeEdited, setAnnouncementToBeEdited] =
    useState<AnnouncementDto>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const openEditModal = (announcement: AnnouncementDto) => {
    setAnnouncementToBeEdited(announcement);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  const editAnnouncement = async (values: AnnouncementFormSchema) => {
    const { subject, body } = values;
    const announcement: AnnouncementUpdateRequestDto = {
      announcement: {
        subject,
        body,
      },
    };
    const announcementApiUrl = `/api/announcements/${announcementToBeEdited?.id}`;
    const response = await makeRequest<
      AnnouncementUpdateResponseDto,
      AnnouncementUpdateRequestDto
    >(announcementApiUrl, 'PATCH', announcement);
    if (!response.ok) {
      showErrorSnackbar();
      return;
    }
    await mutate();
    showSuccessSnackbar('Ogłoszenie zostało zapisane');
    setIsEditModalOpen(false);
  };

  return {
    openEditModal,
    closeEditModal,
    isEditModalOpen,
    editAnnouncement,
    announcementToBeEdited,
  };
};

export const useDeleteAnnouncement = ({
  mutate,
}: AnnouncementHooksArguments) => {
  const makeRequest = useMakeRequestWithAuth();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  const {
    setLoading: setDeleteModalLoading,
    isLoading: isDeleteModalLoading,
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useActionModal();

  const [announcementIdToBeDeleted, setAnnouncementIdToBeDeleted] =
    useState<number>();
  const handleDelete = (id: number) => {
    openDeleteModal();
    setAnnouncementIdToBeDeleted(id);
  };

  const deleteAnnouncement = async () => {
    setDeleteModalLoading(true);
    const announcementsApiUrl = `/api/announcements/${announcementIdToBeDeleted}`;
    const response = await makeRequest<AnnouncementDeleteResponseDto>(
      announcementsApiUrl,
      'DELETE',
    );
    if (!response.ok) {
      showErrorSnackbar();
      return;
    }
    await mutate();
    setDeleteModalLoading(false);
    closeDeleteModal();
    showSuccessSnackbar('Ogłoszenie zostało pomyślnie usunięte');
  };

  return {
    handleDelete,
    closeDeleteModal,
    isDeleteModalOpen,
    isDeleteModalLoading,
    deleteAnnouncement,
  };
};
