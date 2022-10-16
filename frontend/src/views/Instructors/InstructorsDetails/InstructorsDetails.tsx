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
  const [isLoading, setIsLoading] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const {
    setLoading: setActivateModalLoading,
    setOpen: setActivateModalOpen,
    isLoading: isActivateModalLoading,
    isOpen: isActivateModalOpen,
    openModal: openActivateModal,
    closeModal: closeActivateModall,
  } = useActionModal();
  const {
    setLoading: setDeactivateModalLoading,
    setOpen: setDeactivateModalOpen,
    isLoading: isDeactivateModalLoading,
    isOpen: isDeactivateModalOpen,
    openModal: openDeactivateModal,
    closeModal: closeDeactivateModall,
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
  const activateModalTitle = 'Jesteś pewien?';
  const modalTitle = 'Jesteś pewien?';
  const deactivateModalActionButtonLabel = 'Dezaktywuj';
  const deactivateModalSubtitle = `Czy na pewno chcesz dezaktywować tego użytkownika? ${instructor.user.firstName} ${instructor.user.lastName} straci dostęp do wszystkich danych i funkcji systemu`;
  const activateModalActionButtonLabel = 'Aktywuj';
  const activateModalSubtitle= `Czy na pewno chcesz aktywować tego użytkownika?`;

  const initialValues: InstructorsFormData = {
    firstName: instructor.user.firstName,
    lastName: instructor.user.lastName,
    email: instructor.user.email,
    licenseNumber: instructor.licenseNumber,
    registrationNumber: instructor.registrationNumber,
    instructorsQualifications: instructor.instructorsQualifications,
    phoneNumber: instructor.user.phoneNumber,
  };

  const toggleIsUserActive = async () => {
    const {
      photo,
      registrationNumber,
      licenseNumber,
      instructorsQualifications,
      ...userValues
    } = initialValues;
    const body: InstructorUpdateRequestDto = {
      instructor: {
        registrationNumber,
        licenseNumber,
        instructorsQualifications,
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
      showErrorSnackbar();
    } else {
      showSuccessSnackbar(
        `Instruktor ${initialValues.firstName} ${initialValues.lastName} został dezaktywowany`,
      );
    }
    await mutate();
    if (instructor.user.isActive) {
      setDeactivateModalLoading(false);
      setDeactivateModalOpen(false);
    } else {
      setActivateModalLoading(false);
      setActivateModalOpen(false);
    }
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
            {instructor.user.isActive ?
            <LoadingButton
              color="error"
              variant="outlined"
              onClick={() => setDeactivateModalOpen(true)}
              startIcon={<Icon>delete</Icon>}
              disabled={isLoading}
              loading={isLoading}
            >
              Dezaktywuj
            </LoadingButton> :
            <LoadingButton
              color="success"
              variant="outlined"
              onClick={() => setActivateModalOpen(true)}
              startIcon={<Icon>check</Icon>}
              disabled={isLoading}
              loading={isLoading}
            >
              Aktywuj
            </LoadingButton>}
          </Stack>
        </InstructorsForm>
      </Box>
      <ActionModal
        id="deactivateModal"
        isOpen={isDeactivateModalOpen}
        isLoading={isDeactivateModalLoading}
        onClose={() => setDeactivateModalOpen(false)}
        onAction={toggleIsUserActive}
        actionButtonText={deactivateModalActionButtonLabel}
        title="Czy na pewno chcesz dezaktywować tego instruktora?"
        subtitle={
          <span>
            Po dezaktywowaniu {instructor.user.firstName} {instructor.user.lastName} <strong>straci</strong> dostęp do systemu.
          </span>
        }
      />
      <ActionModal
        id="activateModal"
        actionButtonColor='success'
        actionButtonIcon='check'
        isOpen={isActivateModalOpen}
        isLoading={isActivateModalLoading}
        onClose={() => setActivateModalOpen(false)}
        onAction={toggleIsUserActive}
        actionButtonText={activateModalActionButtonLabel}
        title="Czy na pewno chcesz aktywować tego instruktora?"
        subtitle={
          <span>
            Po aktywowaniu {instructor.user.firstName} {instructor.user.lastName} <strong>zyska</strong> dostęp do systemu.
          </span>
        }
      />
    </div>
  );
};
