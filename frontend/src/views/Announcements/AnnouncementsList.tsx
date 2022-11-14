import {
  Button,
  Icon,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AnnouncementCreateRequestDto,
  AnnouncementCreateResponseDto,
  AnnouncementDeleteResponseDto,
  AnnouncementFindAllResponseDto,
  AnnouncementUpdateRequestDto,
  AnnouncementUpdateResponseDto,
  DtoAnnouncement,
} from '@osk/shared';
import { Box, Flex } from 'reflexbox';
import useSWR from 'swr';
import { UserRole } from '@osk/shared/src/types/user.types';
import { useState } from 'react';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useActionModal } from '../../hooks/useActionModal/useActionModal';
import { AnnouncementCard } from './AnnouncementCard/AnnouncementCard';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { ActionModal } from '../../components/ActionModal/ActionModal';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { AnnouncementFormModal } from './AnnouncementFormModal/AnnouncementFormModal';
import { AnnouncementFormSchema } from './AnnouncementFormModal/AnnouncementFormModal.schema';

export const AnnouncementsList = () => {
  const {
    data: announcementsData,
    error: announcementsError,
    mutate,
  } = useSWR<AnnouncementFindAllResponseDto>('/api/announcements');
  const pageTitle = 'Ogłoszenia';
  const { role } = useAuth();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();
  const {
    setLoading: setDeleteModalLoading,
    isLoading: isDeleteModalLoading,
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useActionModal();

  const [announcementIdToBeDeleted, setAnnouncementIdToBeDeleted] =
    useState<number>();
  const [announcementToBeEdited, setAnnouncementToBeEdited] =
    useState<DtoAnnouncement>();
  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] =
    useState(false);
  const [isEditAnnouncementModalOpen, setIsEditAnnouncementModalOpen] =
    useState(false);

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

  const handleCreate = () => {
    setIsCreateAnnouncementModalOpen(true);
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
    setIsCreateAnnouncementModalOpen(false);
  };

  const handleEdit = (announcement: DtoAnnouncement) => {
    setAnnouncementToBeEdited(announcement);
    setIsEditAnnouncementModalOpen(true);
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
    setIsEditAnnouncementModalOpen(false);
  };

  if (announcementsError) {
    return <GeneralAPIError />;
  }

  if (announcementsData === undefined) {
    return <FullPageLoading />;
  }

  const { announcements } = announcementsData;

  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" component="h1">
          {pageTitle}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {role === UserRole.Admin && (
            <Button
              startIcon={<Icon>add</Icon>}
              variant="contained"
              onClick={handleCreate}
            >
              Dodaj Nowe Ogłoszenie
            </Button>
          )}
          <Tooltip title="Filtruj listę">
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <Box style={{ overflow: 'auto' }}>
        <Stack direction="column">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              handleEdit={() => handleEdit(announcement)}
              handleDelete={() => handleDelete(announcement.id)}
            />
          ))}
        </Stack>
      </Box>

      <ActionModal
        id="activateModal"
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteModalLoading}
        onClose={closeDeleteModal}
        onAction={deleteAnnouncement}
        actionButtonText="Usuń"
        title="Czy na pewno chcesz usunąć to ogłoszenie?"
        subtitle="Użytkownicy przestaną widzieć to ogłoszenie w swojej zakładce 'Ogłoszenia'"
      />
      <AnnouncementFormModal
        title="Nowe Ogłoszenie"
        onSave={createAnnouncement}
        onCancel={() => setIsCreateAnnouncementModalOpen(false)}
        isOpen={isCreateAnnouncementModalOpen}
      />
      <AnnouncementFormModal
        title="Edycja Ogłoszenia"
        onSave={editAnnouncement}
        onCancel={() => setIsEditAnnouncementModalOpen(false)}
        isOpen={isEditAnnouncementModalOpen}
        announcement={announcementToBeEdited}
      />
    </Flex>
  );
};
