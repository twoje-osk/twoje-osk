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
import { Link, Navigate, useParams } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { DeactivateModal } from '../../../components/DeactivateModal/DeactivateModal';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { InstructorsForm } from '../InstructorsForm/InstructorsForm';
import { InstructorsFormData } from '../InstructorsForm/InstructorsForm.schema';

export const InstructorsDetails = () => {
  const { instructorId } = useParams();
  const makeRequest = useMakeRequestWithAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const { data, error } = useSWR<InstructorFindOneResponseDto>(
    instructorId ? `/api/instructors/${instructorId}` : null,
  );

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
  const deactivateModalSubtitle = `Czy na pewno chcesz dezaktywować tego użytkownika? \n ${instructor.user.firstName} ${instructor.user.lastName} straci dostęp do wszystkich danych i funkcji systemu`;
  const instructorsQualifications = instructor.instructorsQualifications.map(
    (category) => {
      return category.name;
    },
  );
  const initialValues: InstructorsFormData = {
    firstName: instructor.user.firstName,
    lastName: instructor.user.lastName,
    email: instructor.user.email,
    licenseNumber: instructor.licenseNumber,
    registrationNumber: instructor.registrationNumber,
    instructorsQualifications,
    phoneNumber: instructor.user.phoneNumber,
  };

  const toggleDeactivateModal = () => {
    setIsLoading(!isLoading);
    setShowDeactivateModal(!showDeactivateModal);
  };

  const deactivateUser = async () => {
    const { user, ...instructorValues } = instructor;
    user.isActive = false;
    const body = { instructor: { user, ...instructorValues } };
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

    toggleDeactivateModal();
    showSuccessSnackbar(
      `Instruktor ${response.data.instructor.user.firstName} ${response.data.instructor.user.lastName} został dezaktywowany`,
    );
  };

  if (showDeactivateModal) {
    return (
      <DeactivateModal
        id="deactivateModal"
        isOpen={showDeactivateModal}
        onClose={toggleDeactivateModal}
        onDeactivate={deactivateUser}
        subtitle={deactivateModalSubtitle}
      />
    );
  }

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
        <InstructorsForm
          initialValues={initialValues}
          key={JSON.stringify(initialValues)}
          disabled
        >
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Icon>edit</Icon>}
              component={Link}
              to="edytuj"
            >
              Edytuj
            </Button>
            <LoadingButton
              color="error"
              variant="outlined"
              onClick={toggleDeactivateModal}
              startIcon={<Icon>delete</Icon>}
              disabled={!instructor.user.isActive || isLoading}
              loading={isLoading}
            >
              Dezaktywuj
            </LoadingButton>
          </Stack>
        </InstructorsForm>
      </Box>
    </div>
  );
};
