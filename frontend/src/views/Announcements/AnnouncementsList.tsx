import { Button, Icon, Stack, Toolbar, Typography } from '@mui/material';
import { AnnouncementFindAllResponseDto } from '@osk/shared';
import { Box, Flex } from 'reflexbox';
import useSWR from 'swr';
import { UserRole } from '@osk/shared/src/types/user.types';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { AnnouncementCard } from './AnnouncementCard/AnnouncementCard';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { ActionModal } from '../../components/ActionModal/ActionModal';
import { AnnouncementFormModal } from './AnnouncementFormModal/AnnouncementFormModal';
import {
  useCreateAnouncement,
  useDeleteAnnouncement,
  useEditAnnouncement,
} from './AnnouncementList.hooks';
import { LAYOUT_HEIGHT } from '../Layout/Layout';

export const AnnouncementsList = () => {
  const {
    data: announcementsData,
    error: announcementsError,
    mutate,
  } = useSWR<AnnouncementFindAllResponseDto>('/api/announcements');
  const pageTitle = 'Ogłoszenia';
  const { role } = useAuth();

  const {
    openCreateModal,
    closeCreateModal,
    isCreateModalOpen,
    createAnnouncement,
  } = useCreateAnouncement({ mutate });

  const {
    openEditModal,
    closeEditModal,
    isEditModalOpen,
    editAnnouncement,
    announcementToBeEdited,
  } = useEditAnnouncement({ mutate });

  const {
    handleDelete,
    closeDeleteModal,
    isDeleteModalOpen,
    isDeleteModalLoading,
    deleteAnnouncement,
  } = useDeleteAnnouncement({ mutate });

  if (announcementsError) {
    return <GeneralAPIError />;
  }

  if (announcementsData === undefined) {
    return <FullPageLoading />;
  }

  const { announcements } = announcementsData;

  return (
    <Flex flexDirection="column" height={LAYOUT_HEIGHT}>
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
              onClick={openCreateModal}
            >
              Dodaj Nowe Ogłoszenie
            </Button>
          )}
        </Stack>
      </Toolbar>
      <Box style={{ overflow: 'auto' }}>
        <Stack
          direction="column"
          alignItems="center"
          gap="2rem"
          sx={{ p: '2rem' }}
        >
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              handleEdit={() => openEditModal(announcement)}
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
        onCancel={closeCreateModal}
        isOpen={isCreateModalOpen}
      />
      <AnnouncementFormModal
        title="Edycja Ogłoszenia"
        onSave={editAnnouncement}
        onCancel={closeEditModal}
        isOpen={isEditModalOpen}
        announcement={announcementToBeEdited}
      />
    </Flex>
  );
};
