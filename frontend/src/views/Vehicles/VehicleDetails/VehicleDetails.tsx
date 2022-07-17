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
  VehicleDeleteRequestDto,
  VehicleDeleteResponseDto,
  VehicleFindOneResponseDto,
} from '@osk/shared';
import { parseISO } from 'date-fns';
import { useCallback } from 'react';
import { Navigate, useParams, Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { ActionModal } from '../../../components/ActionModal/ActionModal';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useActionModal } from '../../../hooks/useActionModal/useActionModal';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { VehiclesForm } from '../VehiclesForm/VehiclesForm';
import { VehiclesFormData } from '../VehiclesForm/VehiclesForm.schema';

export const VehicleDetails = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { data, error } = useSWR<VehicleFindOneResponseDto>(
    vehicleId ? `/api/vehicles/${vehicleId}` : null,
  );

  const makeRequest = useMakeRequestWithAuth();
  const {
    isLoading: isDeleteModalLoading,
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    setLoading: setDeleteModalLoading,
  } = useActionModal();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  const onDelete = useCallback(async () => {
    setDeleteModalLoading(true);

    const response = await makeRequest<
      VehicleDeleteRequestDto,
      VehicleDeleteResponseDto
    >(`/api/vehicles/${vehicleId}`, 'DELETE');

    if (!response.ok) {
      setDeleteModalLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate('/pojazdy');
    showSuccessSnackbar(`Pojazd ${data?.vehicle.name} został usunięty`);
  }, [
    data?.vehicle.name,
    makeRequest,
    navigate,
    setDeleteModalLoading,
    showErrorSnackbar,
    showSuccessSnackbar,
    vehicleId,
  ]);

  if (vehicleId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const { vehicle } = data;

  const initialValues: VehiclesFormData = {
    name: vehicle.name,
    licensePlate: vehicle.licensePlate,
    vin: vehicle.vin,
    dateOfNextCheck: parseISO(vehicle.dateOfNextCheck),
    additionalDetails: vehicle.additionalDetails ?? undefined,
    notes: vehicle.notes ?? undefined,
    photo: vehicle.photo,
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
            to="/pojazdy"
            component={Link}
            variant="h6"
          >
            Pojazdy
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {vehicle.name} ({vehicle.licensePlate})
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <VehiclesForm initialValues={initialValues} disabled>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Icon>edit</Icon>}
              component={Link}
              to="edytuj"
            >
              Edytuj
            </Button>
            <Button
              color="error"
              variant="outlined"
              startIcon={<Icon>delete</Icon>}
              onClick={openDeleteModal}
            >
              Usuń
            </Button>
          </Stack>
        </VehiclesForm>
      </Box>
      <ActionModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteModalLoading}
        onClose={closeDeleteModal}
        onAction={onDelete}
        id="delete-vehicle-modal"
        title="Czy na pewno chcesz usunąć ten pojazd?"
      />
    </div>
  );
};
