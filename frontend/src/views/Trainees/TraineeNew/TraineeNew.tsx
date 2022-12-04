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
import { TraineeAddNewRequestDto, TraineeAddNewResponseDto } from '@osk/shared';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { formatApi } from '../../../utils/date';
import { TraineeForm } from '../TraineeForm/TraineeForm';
import { TraineeFormData } from '../TraineeForm/TraineeForm.schema';

export const TraineeNew = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const onSubmit = async (newTrainee: TraineeFormData) => {
    setIsLoading(true);

    const body: TraineeAddNewRequestDto = {
      trainee: {
        pesel: newTrainee.pesel || null,
        pkk: newTrainee.pkk,
        driversLicenseNumber: newTrainee.driversLicenseNumber || null,
        dateOfBirth: formatApi(newTrainee.dateOfBirth),
        user: {
          email: newTrainee.email,
          firstName: newTrainee.firstName,
          lastName: newTrainee.lastName,
          phoneNumber: newTrainee.phoneNumber,
          isActive: false,
        },
      },
    };

    const response = await makeRequest<
      TraineeAddNewResponseDto,
      TraineeAddNewRequestDto
    >(`/api/trainees`, 'POST', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate(`/kursanci/${response.data.trainee.id}`);
    const fullName = `${response.data.trainee.user.firstName} ${response.data.trainee.user.lastName}`;
    showSuccessSnackbar(`Kursant ${fullName} został zmodyfikowany`);
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
            Nowy
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <TraineeForm onSubmit={onSubmit} hideCreatedAt>
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
              to="/kursanci"
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </Stack>
        </TraineeForm>
      </Box>
    </div>
  );
};
