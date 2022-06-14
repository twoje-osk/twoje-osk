import {
  Breadcrumbs,
  Button,
  Icon,
  Link as MUILink,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { TraineeFindOneResponseDto } from '@osk/shared';
import { parseISO } from 'date-fns';
import { useCallback } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { DeleteModal } from '../../../components/DeleteModal/DeleteModal';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useDeleteModal } from '../../../hooks/useDeleteModal/useDeleteModal';
import { theme } from '../../../theme';
import { TraineeForm } from '../TraineeForm/TraineeForm';
import { TraineeFormData } from '../TraineeForm/TraineeForm.schema';

export const TraineeDetails = () => {
  const { traineeId } = useParams();
  const { data, error, mutate } = useSWR<TraineeFindOneResponseDto>(
    traineeId ? `/api/trainees/${traineeId}` : null,
  );

  const {
    isLoading: isDeleteModalLoading,
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    setLoading: setDeleteModalLoading,
  } = useDeleteModal();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  const onDelete = useCallback(async () => {
    setDeleteModalLoading(true);

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));

    const response = { ok: true };

    if (!response.ok) {
      setDeleteModalLoading(false);
      showErrorSnackbar();
      return;
    }

    const fullName = `${data?.trainee.user.firstName} ${data?.trainee.user.lastName}`;
    showSuccessSnackbar(`Kursant ${fullName} został pomyślnie deaktywowany`);
    await mutate();
    setDeleteModalLoading(false);
    closeDeleteModal();
  }, [
    closeDeleteModal,
    data?.trainee.user.firstName,
    data?.trainee.user.lastName,
    mutate,
    setDeleteModalLoading,
    showErrorSnackbar,
    showSuccessSnackbar,
  ]);

  if (traineeId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const { trainee } = data;

  const initialValues: TraineeFormData = {
    firstName: trainee.user.firstName,
    lastName: trainee.user.lastName,
    email: trainee.user.email,
    phoneNumber: trainee.user.phoneNumber,
    pesel: trainee.pesel,
    pkk: trainee.pkk,
    driversLicenseNumber: trainee.driversLicenseNumber ?? 'Brak',
    createdAt: parseISO(trainee.user.createdAt),
  };

  return (
    <div>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
          <MUILink
            underline="hover"
            to="/kursanci"
            component={Link}
            variant="h6"
          >
            Kursanci
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {trainee.user.firstName} {trainee.user.lastName}
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <TraineeForm initialValues={initialValues} disabled>
          <Stack direction="row" spacing={1}>
            <Button variant="contained">Zobacz Raport Postępów</Button>
            <Button
              variant="outlined"
              startIcon={<Icon>edit</Icon>}
              component={Link}
              to="edytuj"
            >
              Edytuj
            </Button>
            {!trainee.user.isActive ? (
              <Button
                color="success"
                variant="outlined"
                startIcon={<Icon>check</Icon>}
                onClick={openDeleteModal}
              >
                Aktywuj
              </Button>
            ) : (
              <Button
                color="error"
                variant="outlined"
                startIcon={<Icon>delete</Icon>}
                onClick={openDeleteModal}
              >
                Deaktywuj
              </Button>
            )}
          </Stack>
        </TraineeForm>
      </Box>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteModalLoading}
        onClose={closeDeleteModal}
        onDelete={onDelete}
        id="deactivate-trainee-modal"
        title="Czy na pewno chcesz deaktywować tego kursanta?"
        subtitle="Po deaktywowaniu kursant nie będzie w stanie zalogować się do systemu."
        deleteButtonText="Deaktywuj"
      />
    </div>
  );
};
