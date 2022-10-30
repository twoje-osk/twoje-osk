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
import { Link, Navigate, useParams } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { useActionModal } from '../../../hooks/useActionModal/useActionModal';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { InstructorsForm } from '../InstructorsForm/InstructorsForm';
import { InstructorsFormData } from '../InstructorsForm/InstructorsForm.schema';
import { ActionModal } from '../../../components/ActionModal/ActionModal';

export const InstructorsDetails = () => {
  const { instructorId } = useParams();
  const makeRequest = useMakeRequestWithAuth();
  const {
    setLoading: setActivateModalLoading,
    isLoading: isActivateModalLoading,
    isOpen: isActivateModalOpen,
    openModal: openActivateModal,
    closeModal: closeActivateModal,
  } = useActionModal();
  const {
    setLoading: setDeactivateModalLoading,
    isLoading: isDeactivateModalLoading,
    isOpen: isDeactivateModalOpen,
    openModal: openDeactivateModal,
    closeModal: closeDeactivateModal,
  } = useActionModal();
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const { data, error, mutate } = useSWR<InstructorFindOneResponseDto>(
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

  const initialValues: InstructorsFormData = {
    firstName: instructor.user.firstName,
    lastName: instructor.user.lastName,
    email: instructor.user.email,
    licenseNumber: instructor.licenseNumber,
    registrationNumber: instructor.registrationNumber,
    instructorsQualificationsIds: instructor.instructorsQualificationsIds,
    phoneNumber: instructor.user.phoneNumber,
  };

  const toggleIsUserActive = async () => {
    const setModalLoading = instructor.user.isActive
      ? setDeactivateModalLoading
      : setActivateModalLoading;
    const snackbarMessage = instructor.user.isActive
      ? `Instruktor ${initialValues.firstName} ${initialValues.lastName} został dezaktywowany`
      : `Instruktor ${initialValues.firstName} ${initialValues.lastName} został aktywowany`;
    const closeModal = instructor.user.isActive
      ? closeDeactivateModal
      : closeActivateModal;
    const {
      photo,
      registrationNumber,
      licenseNumber,
      instructorsQualificationsIds,
      ...userValues
    } = initialValues;
    const body: InstructorUpdateRequestDto = {
      instructor: {
        registrationNumber,
        licenseNumber,
        instructorsQualificationsIds,
        user: {
          ...userValues,
          isActive: !instructor.user.isActive,
        },
        photo,
      },
    };
    if (instructor.user.isActive) {
      setDeactivateModalLoading(true);
    } else {
      setActivateModalLoading(true);
    }
    const instructorApiUrl = `/api/instructors/${instructorId}`;
    const response = await makeRequest<
      InstructorUpdateResponseDto,
      InstructorUpdateRequestDto
    >(instructorApiUrl, 'PATCH', body);

    if (!response.ok) {
      setModalLoading(false);
      showErrorSnackbar();
      return;
    }

    setModalLoading(false);
    showSuccessSnackbar(snackbarMessage);

    await mutate();
    closeModal();
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
            {instructor.user.isActive ? (
              <LoadingButton
                color="error"
                variant="outlined"
                onClick={() => openDeactivateModal()}
                startIcon={<Icon>delete</Icon>}
                disabled={isDeactivateModalLoading}
                loading={isDeactivateModalLoading}
              >
                Dezaktywuj
              </LoadingButton>
            ) : (
              <LoadingButton
                color="success"
                variant="outlined"
                onClick={() => openActivateModal()}
                startIcon={<Icon>check</Icon>}
                disabled={isActivateModalLoading}
                loading={isActivateModalLoading}
              >
                Aktywuj
              </LoadingButton>
            )}
          </Stack>
        </InstructorsForm>
      </Box>
      <ActionModal
        id="deactivateModal"
        isOpen={isDeactivateModalOpen}
        isLoading={isDeactivateModalLoading}
        onClose={closeDeactivateModal}
        onAction={toggleIsUserActive}
        actionButtonText="Dezaktywuj"
        title="Czy na pewno chcesz dezaktywować tego instruktora?"
        subtitle={
          <span>
            Po dezaktywowaniu {instructor.user.firstName}{' '}
            {instructor.user.lastName} <strong>straci</strong> dostęp do
            systemu.
          </span>
        }
      />
      <ActionModal
        id="activateModal"
        actionButtonColor="success"
        actionButtonIcon="check"
        isOpen={isActivateModalOpen}
        isLoading={isActivateModalLoading}
        onClose={closeActivateModal}
        onAction={toggleIsUserActive}
        actionButtonText="Aktywuj"
        title="Czy na pewno chcesz aktywować tego instruktora?"
        subtitle={
          <span>
            Po aktywowaniu {instructor.user.firstName}{' '}
            {instructor.user.lastName} <strong>zyska</strong> dostęp do systemu.
          </span>
        }
      />
    </div>
  );
};
