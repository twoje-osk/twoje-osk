import {
  Breadcrumbs,
  Button,
  Icon,
  Link as MUILink,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { VehicleFindOneResponseDto } from '@osk/shared';
import { isValid, parseISO } from 'date-fns';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { theme } from '../../../theme';
import { VehiclesForm } from '../VehiclesForm/VehiclesForm';
import { VehiclesFormData } from '../VehiclesForm/VehiclesForm.schema';

export const VehicleEdit = () => {
  const { vehicleId } = useParams();
  const { data, error } = useSWR<VehicleFindOneResponseDto>(
    vehicleId ? `/api/vehicles/${vehicleId}` : null,
  );

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
        <VehiclesForm initialValues={initialValues}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<Icon>save</Icon>}>
              Zapisz
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to={`/pojazdy/${vehicleId}`}
            >
              Anuluj
            </Button>
          </Stack>
        </VehiclesForm>
      </Box>
    </div>
  );
};
