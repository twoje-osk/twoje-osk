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
  TraineeFindOneResponseDto,
  TraineeUpdateRequestDto,
  TraineeUpdateResponseDto,
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
import { TraineeForm } from '../TraineeForm/TraineeForm';
import { TraineeFormData } from '../TraineeForm/TraineeForm.schema';

export const TraineeEdit = () => {
  const { traineeId } = useParams();
  const { data, error } = useSWR<TraineeFindOneResponseDto>(
    traineeId ? `/api/trainees/${traineeId}` : null,
  );
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();

  const onEdit = async (editedTrainee: TraineeFormData) => {
    setIsLoading(true);

    const body: TraineeUpdateRequestDto = {
      trainee: {
        pesel: editedTrainee.pesel,
        pkk: editedTrainee.pkk,
        driversLicenseNumber: editedTrainee.driversLicenseNumber || null,
        user: {
          email: editedTrainee.email,
          firstName: editedTrainee.firstName,
          lastName: editedTrainee.lastName,
          phoneNumber: editedTrainee.phoneNumber,
        },
      },
    };

    const response = await makeRequest<
      TraineeUpdateResponseDto,
      TraineeUpdateRequestDto
    >(`/api/trainees/${traineeId}`, 'PATCH', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate(`/kursanci/${traineeId}`);
    const fullName = `${data?.trainee.user.firstName} ${data?.trainee.user.lastName}`;
    showSuccessSnackbar(`Kursant ${fullName} został zmodyfikowany`);
  };

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
    pesel: trainee.pesel ?? undefined,
    dateOfBirth: parseISO(trainee.dateOfBirth),
    pkk: trainee.pkk,
    driversLicenseNumber: trainee.driversLicenseNumber ?? undefined,
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
          <MUILink
            underline="hover"
            to={`/kursanci/${traineeId}`}
            component={Link}
            variant="h6"
          >
            {trainee.user.firstName} {trainee.user.lastName}
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            Edytuj
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <TraineeForm
          initialValues={initialValues}
          onSubmit={onEdit}
          hideCreatedAt
        >
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
              to={`/kursanci/${traineeId}`}
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
