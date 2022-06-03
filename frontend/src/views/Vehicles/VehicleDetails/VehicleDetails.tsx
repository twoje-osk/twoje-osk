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
import { isValid, parseISO } from 'date-fns';
import { useCallback } from 'react';
import { Navigate, useParams, Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { DeleteModal } from '../../../components/DeleteModal/DeleteModal';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useDeleteModal } from '../../../hooks/useDeleteModal/useDeleteModal';
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
  } = useDeleteModal();
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

  const parsedDateOfNextCheck = parseISO(vehicle.dateOfNextCheck);
  const initialValues: VehiclesFormData = {
    name: vehicle.name,
    licensePlate: vehicle.licensePlate,
    vin: vehicle.vin,
    dateOfNextCheck: isValid(parsedDateOfNextCheck)
      ? parsedDateOfNextCheck
      : null,
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
              to="edit"
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
      <DeleteModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteModalLoading}
        onClose={closeDeleteModal}
        id="delete-vehicle-modal"
        onDelete={onDelete}
        title="Czy na pewno chcesz usunąć ten pojazd?"
        subtitle="Ta akcja jest nieodwracalna."
      />
    </div>
  );
};
