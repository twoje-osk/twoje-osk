import { LoadingButton } from '@mui/lab';
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
  VehicleFindOneResponseDto,
  VehicleUpdateRequestDto,
  VehicleUpdateResponseDto,
} from '@osk/shared';
import { parseISO } from 'date-fns';
import { useState } from 'react';
import { Navigate, useParams, Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { formatApi } from '../../../utils/date';
import { VehiclesForm } from '../VehiclesForm/VehiclesForm';
import {
  VehiclesFormData,
  VehiclesSubmitData,
} from '../VehiclesForm/VehiclesForm.schema';

export const VehicleEdit = () => {
  const { vehicleId } = useParams();
  const makeRequest = useMakeRequestWithAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  const { data, error } = useSWR<VehicleFindOneResponseDto>(
    vehicleId ? `/api/vehicles/${vehicleId}` : null,
  );

  const onEdit = async (editedVehicle: VehiclesSubmitData) => {
    const body: VehicleUpdateRequestDto = {
      vehicle: {
        ...editedVehicle,
        dateOfNextCheck: formatApi(editedVehicle.dateOfNextCheck) ?? undefined,
      },
    };

    setIsLoading(true);
    const vehicleApiUrl = `/api/vehicles/${vehicleId}`;
    const response = await makeRequest<
      VehicleUpdateResponseDto,
      VehicleUpdateRequestDto
    >(vehicleApiUrl, 'PATCH', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate(`/pojazdy/${vehicleId}`);
    showSuccessSnackbar(`Pojazd ${data?.vehicle.name} został zmodyfikowany`);
  };

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
    photo: vehicle.photo ?? undefined,
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
          <MUILink
            underline="hover"
            to={`/pojazdy/${vehicleId}`}
            component={Link}
            variant="h6"
          >
            {vehicle.name} ({vehicle.licensePlate})
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            Edytuj
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <VehiclesForm initialValues={initialValues} onSubmit={onEdit}>
          <Stack direction="row" spacing={1}>
            <LoadingButton
              variant="contained"
              startIcon={<Icon>save</Icon>}
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Zapisz
            </LoadingButton>
            <Button
              variant="outlined"
              component={Link}
              to={`/pojazdy/${vehicleId}`}
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </Stack>
        </VehiclesForm>
      </Box>
    </div>
  );
};
