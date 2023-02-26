import { LoadingButton } from '@mui/lab';
import { Icon, Stack, Toolbar, Typography } from '@mui/material';
import { UserMyProfileResponseDto } from '@osk/shared';
import { UserRole } from '@osk/shared/src/types/user.types';
import { useFormikContext } from 'formik';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { theme } from '../../theme';
import { MyProfileForm } from './MyProfileForm/MyProfileForm';

export const MyProfile = () => {
  const { role } = useAuth();
  const disabledFields =
    role !== UserRole.Admin ? (['firstName', 'lastName'] as const) : [];
  const { data, error } = useSWR<UserMyProfileResponseDto>('/api/users/me');

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const initialValues = {
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
        >
          <FormActions />
        </MyProfileForm>
      </Box>
    </div>
  );
};

const FormActions = () => {
  const { dirty } = useFormikContext();

  return (
    <Stack direction="row" spacing={1}>
      <LoadingButton
        variant="contained"
        startIcon={<Icon>save</Icon>}
        type="submit"
        // loading={isLoading}
        disabled={!dirty}
      >
        Zapisz
      </LoadingButton>
    </Stack>
  );
};
