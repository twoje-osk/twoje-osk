import { LoadingButton } from '@mui/lab';
import { Icon, Stack, Toolbar, Typography } from '@mui/material';
import {
  UpdateUserMyProfileRequestDto,
  UpdateUserMyProfileResponseDto,
  UserMyProfileResponseDto,
} from '@osk/shared';
import { UserRole } from '@osk/shared/src/types/user.types';
import { FormikHelpers, useFormikContext } from 'formik';
import { useState } from 'react';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../theme';
import { MyProfileForm } from './MyProfileForm/MyProfileForm';
import { MyProfileFormData } from './MyProfileForm/MyProfileForm.schema';

export const MyProfile = () => {
  const { role } = useAuth();
  const disabledFields =
    role !== UserRole.Admin ? (['firstName', 'lastName'] as const) : [];
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  const makeRequest = useMakeRequestWithAuth();
  const { data, error } = useSWR<UserMyProfileResponseDto>('/api/users/me');

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const handleSubmit = async (
    myProfileValues: MyProfileFormData,
    formikHelpers: FormikHelpers<MyProfileFormData>,
  ) => {
    const passwordBody =
      myProfileValues.newPassword && myProfileValues.oldPassword
        ? {
            newPassword: myProfileValues.newPassword,
            oldPassword: myProfileValues.oldPassword,
          }
        : {};

    const body = {
      ...passwordBody,
      email: myProfileValues.email,
      firstName: myProfileValues.firstName,
      lastName: myProfileValues.lastName,
      phoneNumber: myProfileValues.phoneNumber,
    };

    setIsLoading(true);
    const updateApiUrl = `/api/users/me`;
    const response = await makeRequest<
      UpdateUserMyProfileResponseDto,
      UpdateUserMyProfileRequestDto
    >(updateApiUrl, 'PUT', body);

    if (response.ok) {
      setIsLoading(false);
      showSuccessSnackbar(`Twoje dane zostały zmodyfikowane`);

      formikHelpers.resetForm({
        values: {
          email: myProfileValues.email,
          firstName: myProfileValues.firstName,
          lastName: myProfileValues.lastName,
          phoneNumber: myProfileValues.phoneNumber,
          newPassword: '',
          oldPassword: '',
        },
      });

      return;
    }

    if (response.error.message === 'OLD_PASSWORD_INCORRECT') {
      formikHelpers.setFieldError('oldPassword', 'Niepoprawne hasło');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    showErrorSnackbar();
  };

  const initialValues: MyProfileFormData = {
    email: data.user.email,
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    phoneNumber: data.user.phoneNumber,
    newPassword: '',
    oldPassword: '',
  };

  return (
    <div>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography variant="h6" color={theme.palette.text.primary}>
          Mój Profil
        </Typography>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <MyProfileForm
          initialValues={initialValues}
          disabledFields={disabledFields}
          onSubmit={handleSubmit}
        >
          <FormActions isLoading={isLoading} />
        </MyProfileForm>
      </Box>
    </div>
  );
};

interface FromActionsProps {
  isLoading: boolean;
}
const FormActions = ({ isLoading }: FromActionsProps) => {
  const { dirty } = useFormikContext();

  return (
    <Stack direction="row" spacing={1}>
      <LoadingButton
        variant="contained"
        startIcon={<Icon>save</Icon>}
        type="submit"
        loading={isLoading}
        disabled={!dirty || isLoading}
      >
        Zapisz
      </LoadingButton>
    </Stack>
  );
};
