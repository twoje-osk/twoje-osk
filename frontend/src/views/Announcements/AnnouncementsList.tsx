import {
  Button,
  Divider,
  Icon,
  Stack,
  TablePagination,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AnnouncementFindAllQueryDto,
  AnnouncementFindAllResponseDto,
} from '@osk/shared';
import { Box, Flex } from 'reflexbox';
import useSWR from 'swr';
import { UserRole } from '@osk/shared/src/types/user.types';
import { useMemo } from 'react';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { AnnouncementCard } from './AnnouncementCard/AnnouncementCard';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { ActionModal } from '../../components/ActionModal/ActionModal';
import { AnnouncementFormModal } from './AnnouncementFormModal/AnnouncementFormModal';
import {
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useEditAnnouncement,
} from './AnnouncementList.hooks';
import { LAYOUT_HEIGHT } from '../Layout/Layout';
import { usePagination } from '../../hooks/usePagination/usePagination';
import { addQueryParams } from '../../utils/addQueryParams';
import { theme } from '../../theme';
import { useListTotal } from '../../hooks/useListTotal/useListTotal';

export const AnnouncementsList = () => {
  const pageTitle = 'Ogłoszenia';
  const { role } = useAuth();
  const { rowsPerPage, currentPage, onPageChange, onRowsPerPageChange } =
    usePagination(5);

  const apiUrl = useMemo(
    () =>
      addQueryParams<AnnouncementFindAllQueryDto>('/api/announcements', {
        page: currentPage,
        pageSize: rowsPerPage,
      }),
    [currentPage, rowsPerPage],
  );
  const {
    data: announcementsData,
    error: announcementsError,
    mutate,
  } = useSWR<AnnouncementFindAllResponseDto>(apiUrl);

  const {
    openCreateModal,
    closeCreateModal,
    isCreateModalOpen,
    createAnnouncement,
  } = useCreateAnnouncement({ mutate });

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

  const total = useListTotal(announcementsData?.total);
  const announcements = announcementsData?.announcements;

  if (announcementsError) {
    return <GeneralAPIError />;
  }

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
      <Divider />
      <Box
        flex="1"
        style={{ overflow: 'auto', background: theme.palette.grey[300] }}
      >
        {announcements !== undefined ? (
          <Stack
            direction="column"
            alignItems="center"
            gap="2rem"
            sx={{ p: '2rem' }}
          >
            {announcements?.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                handleEdit={() => openEditModal(announcement)}
                handleDelete={() => handleDelete(announcement.id)}
              />
            ))}
          </Stack>
        ) : (
          <FullPageLoading />
        )}
      </Box>

      <Divider />
      <Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage="Ogłoszeń na stronie:"
          labelDisplayedRows={({ from, to, count }) => {
            const ofPart = count !== -1 ? count : `more than ${to}`;

            return `${from}–${to} z ${ofPart}`;
          }}
        />
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
