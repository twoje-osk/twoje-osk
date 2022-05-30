import {
  Breadcrumbs,
  Icon,
  Link as MUILink,
  Toolbar,
  Typography,
} from '@mui/material';
import { VehicleFindOneResponseDto } from '@osk/shared';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { theme } from '../../../theme';

export const VehicleDetails = () => {
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
            Nazwa ({vehicle.licensePlate})
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <Typography variant="h6" component="h2">
          Nazwa
        </Typography>
        <div>Nazwa</div>
        <Typography variant="h6" component="h2">
          Numer Rejestracyjny
        </Typography>
        <div>{vehicle.licensePlate}</div>
        <Typography variant="h6" component="h2">
          Numer VIN
        </Typography>
        <div>Numer VIN</div>
        <Typography variant="h6" component="h2">
          Data Następnego Przeglądu
        </Typography>
        <div>Data Następnego Przeglądu</div>
        <Typography variant="h6" component="h2">
          Dodatkowe Informacje
        </Typography>
        <div>Dodatkowe Informacje</div>
        <Typography variant="h6" component="h2">
          Notatki
        </Typography>
        <div>Notatki</div>
      </Box>
    </div>
  );
};
