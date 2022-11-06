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
  AnnouncementDeleteResponseDto,
  AnnouncementFindAllResponseDto,
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

  const [announcementToBeDeleted, setAnnouncementToBeDeleted] =
    useState<number>();
  const [announcementToBeEdited, setAnnouncementToBeEdited] =
    useState<DtoAnnouncement>();
  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] =
    useState(false);
  const [isEditAnnouncementModalOpen, setIsEditAnnouncementModalOpen] =
    useState(false);

  const handleDelete = (id: number) => {
    openDeleteModal();
    setAnnouncementToBeDeleted(id);
  };

  const deleteAnnouncement = async () => {
    setDeleteModalLoading(true);
    const announcementsApiUrl = `/api/announcements/${announcementToBeDeleted}`;
    const response = await makeRequest<AnnouncementDeleteResponseDto>(
      announcementsApiUrl,
      'DELETE',
    );
    setDeleteModalLoading(false);
    if (!response.ok) {
      showErrorSnackbar();
      return;
    }
    setDeleteModalLoading(false);
    closeDeleteModal();
    await mutate();
    showSuccessSnackbar('Ogłoszenie zostało pomyślnie usunięte');
  };

  const handleCreate = () => {
    setIsCreateAnnouncementModalOpen(true);
  };

  const createAnnouncement = () => {};

  const handleEdit = (announcement: DtoAnnouncement) => {
    setAnnouncementToBeEdited(announcement);
    setIsEditAnnouncementModalOpen(true);
  };

  const editAnnouncement = () => {};

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
          mb: '2rem',
        }}
      >
        <Typography sx={{ flex: '1 1 30%' }} variant="h6" component="h1">
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
          {announcements.map((announcement: DtoAnnouncement) => {
            return (
              <AnnouncementCard
                announcement={announcement}
                handleEdit={() => handleEdit(announcement)}
                handleDelete={() => handleDelete(announcement.id)}
              />
            );
          })}
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
