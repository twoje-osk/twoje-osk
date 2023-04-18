import {
  Breadcrumbs,
  Button,
  Icon,
  Link as MUILink,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  TraineeFindOneResponseDto,
  TraineeUpdateRequestDto,
  TraineeUpdateResponseDto,
} from '@osk/shared';
import { parseISO } from 'date-fns';
import { useCallback } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { ActionModal } from '../../../components/ActionModal/ActionModal';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useActionModal } from '../../../hooks/useActionModal/useActionModal';
import { theme } from '../../../theme';
import { TraineeForm } from '../TraineeForm/TraineeForm';
import { TraineeFormData } from '../TraineeForm/TraineeForm.schema';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';

export const TraineeDetails = () => {
  const { traineeId } = useParams();
  const { data, error, mutate } = useSWR<TraineeFindOneResponseDto>(
    traineeId ? `/api/trainees/${traineeId}` : null,
  );
  const makeRequest = useMakeRequestWithAuth();

  const {
    isLoading: isDeactivateModalLoading,
    isOpen: isDeactivateModalOpen,
    openModal: openDeactivateModal,
    closeModal: closeDeactivateModal,
    setLoading: setDeactivateModalLoading,
  } = useActionModal();
  const {
    isLoading: isActivateModalLoading,
    isOpen: isActivateModalOpen,
    openModal: openActivateModal,
    closeModal: closeActivateModal,
    setLoading: setActivateModalLoading,
  } = useActionModal();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  const onDeactivate = useCallback(async () => {
    setDeactivateModalLoading(true);

    const body: TraineeUpdateRequestDto = {
      trainee: {
        user: {
          isActive: false,
        },
      },
    };

    const response = await makeRequest<
      TraineeUpdateResponseDto,
      TraineeUpdateRequestDto
    >(`/api/trainees/${traineeId}`, 'PATCH', body);

    if (!response.ok) {
      setDeactivateModalLoading(false);
      showErrorSnackbar();
      return;
    }

    const fullName = `${data?.trainee.user.firstName} ${data?.trainee.user.lastName}`;
    showSuccessSnackbar(`Kursant ${fullName} został pomyślnie deaktywowany`);
    await mutate();
    setDeactivateModalLoading(false);
    closeDeactivateModal();
  }, [
    closeDeactivateModal,
    data?.trainee.user.firstName,
    data?.trainee.user.lastName,
    makeRequest,
    mutate,
    setDeactivateModalLoading,
    showErrorSnackbar,
    showSuccessSnackbar,
    traineeId,
  ]);

  const onActivate = useCallback(async () => {
    setActivateModalLoading(true);

    const body: TraineeUpdateRequestDto = {
      trainee: {
        user: {
          isActive: true,
        },
      },
    };

    const response = await makeRequest<
      TraineeUpdateResponseDto,
      TraineeUpdateRequestDto
    >(`/api/trainees/${traineeId}`, 'PATCH', body);

    if (!response.ok) {
      setActivateModalLoading(false);
      showErrorSnackbar();
      return;
    }

    const fullName = `${data?.trainee.user.firstName} ${data?.trainee.user.lastName}`;
    showSuccessSnackbar(`Kursant ${fullName} został pomyślnie aktywowany`);
    await mutate();
    setActivateModalLoading(false);
    closeActivateModal();
  }, [
    closeActivateModal,
    data?.trainee.user.firstName,
    data?.trainee.user.lastName,
    makeRequest,
    mutate,
    setActivateModalLoading,
    showErrorSnackbar,
    showSuccessSnackbar,
    traineeId,
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
    pesel: trainee.pesel ?? 'Brak',
    dateOfBirth: parseISO(trainee.dateOfBirth),
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
                onClick={openActivateModal}
              >
                Aktywuj
              </Button>
            ) : (
              <Button
                color="error"
                variant="outlined"
                startIcon={<Icon>delete</Icon>}
                onClick={openDeactivateModal}
              >
                Dezaktywuj
              </Button>
            )}
          </Stack>
        </TraineeForm>
      </Box>
      <ActionModal
        isOpen={isDeactivateModalOpen}
        isLoading={isDeactivateModalLoading}
        onClose={closeDeactivateModal}
        onAction={onDeactivate}
        id="deactivate-trainee-modal"
        title="Czy na pewno chcesz dezaktywować tego kursanta?"
        subtitle={
          <span>
            Po dezaktywowaniu kursant <strong>straci</strong> dostęp do systemu.
          </span>
        }
        actionButtonText="Dezaktywuj"
      />
      <ActionModal
        isOpen={isActivateModalOpen}
        isLoading={isActivateModalLoading}
        onClose={closeActivateModal}
        onAction={onActivate}
        id="activate-trainee-modal"
        title="Czy na pewno chcesz aktywować tego kursanta?"
        subtitle={
          <span>
            Po aktywowaniu kursant <strong>uzyska</strong> dostęp do systemu.
          </span>
        }
        actionButtonText="Aktywuj"
        actionButtonColor="success"
        actionButtonIcon="check"
      />
    </div>
  );
};
