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
import { VehicleAddNewRequestDto, VehicleAddNewResponseDto } from '@osk/shared';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { formatApi } from '../../../utils/date';
import { VehiclesForm } from '../VehiclesForm/VehiclesForm';
import { VehiclesSubmitData } from '../VehiclesForm/VehiclesForm.schema';

export const VehicleNew = () => {
  const makeRequest = useMakeRequestWithAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  const onEdit = async (createdVehicle: VehiclesSubmitData) => {
    const body: VehicleAddNewRequestDto = {
      vehicle: {
        ...createdVehicle,
        dateOfNextCheck: formatApi(createdVehicle.dateOfNextCheck),
        additionalDetails: createdVehicle.additionalDetails ?? null,
        notes: createdVehicle.notes ?? null,
        photo: createdVehicle.photo ?? null,
      },
    };

    setIsLoading(true);
    const response = await makeRequest<
      VehicleAddNewResponseDto,
      VehicleAddNewRequestDto
    >(`/api/vehicles`, 'POST', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate(`/pojazdy/${response.data.vehicle.id}`);
    showSuccessSnackbar(`Pojazd ${createdVehicle.name} został stworzony`);
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
            Nowy
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <VehiclesForm onSubmit={onEdit}>
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
              to="/pojazdy"
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
