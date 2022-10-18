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
  InstructorFindOneResponseDto,
  InstructorUpdateRequestDto,
  InstructorUpdateResponseDto,
} from '@osk/shared';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { InstructorsForm } from '../InstructorsForm/InstructorsForm';
import { InstructorsFormData } from '../InstructorsForm/InstructorsForm.schema';

export const InstructorsEdit = () => {
  const { instructorId } = useParams();
  const makeRequest = useMakeRequestWithAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { data, error } = useSWR<InstructorFindOneResponseDto>(
    instructorId ? `/api/instructors/${instructorId}` : null,
  );

  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  if (instructorId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const { instructor } = data;
  const initialValues: InstructorsFormData = {
    firstName: instructor.user.firstName,
    lastName: instructor.user.lastName,
    email: instructor.user.email,
    licenseNumber: instructor.licenseNumber,
    registrationNumber: instructor.registrationNumber,
    instructorsQualificationsIds: instructor.instructorsQualificationsIds,
    phoneNumber: instructor.user.phoneNumber,
  };

  const handleSubmit = async (instructorValues: InstructorsFormData) => {
    const {
      photo,
      registrationNumber,
      licenseNumber,
      instructorsQualificationsIds,
      ...userValues
    } = instructorValues;
    const body: InstructorUpdateRequestDto = {
      instructor: {
        registrationNumber,
        licenseNumber,
        instructorsQualificationsIds,
        user: { ...userValues },
        photo,
      },
    };

    setIsLoading(true);
    const instructorApiUrl = `/api/instructors/${instructorId}`;
    const response = await makeRequest<
      InstructorUpdateResponseDto,
      InstructorUpdateRequestDto
    >(instructorApiUrl, 'PATCH', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate(`/instruktorzy/${response.data.id}`);
    showSuccessSnackbar(
      `Instruktor ${initialValues.firstName} ${initialValues.lastName} został zmodyfikowany`,
    );
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
            to="/instruktorzy"
            component={Link}
            variant="h6"
          >
            Instruktorzy
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {instructor.user.firstName} {instructor.user.lastName}
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <InstructorsForm initialValues={initialValues} onSubmit={handleSubmit}>
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
              to={`/instruktorzy/${instructorId}`}
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </Stack>
        </InstructorsForm>
      </Box>
    </div>
  );
};
