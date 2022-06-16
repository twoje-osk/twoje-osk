import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Container,
  Icon,
  Paper,
  Typography,
} from '@mui/material';
import { OrganizationGetPublicInfoResponseDto } from '@osk/shared';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Flex } from 'reflexbox';
import useSWR from 'swr';
import { FTextField } from '../../components/FTextField/FTextField';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { RequireAuthLocationState } from '../../components/RequireAuth/RequireAuth';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { LoginForm, LoginFormSchema } from './Login.schema';
import { LoginHiddenWrapper, LoginLoaderWrapper } from './Login.styled';
import { authenticate } from './Login.utils';

export const Login = () => {
  const { data, error } =
    useSWR<OrganizationGetPublicInfoResponseDto>('/api/organization');

  const oskName = data?.organization.name;
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const { accessToken, logIn } = useAuth();
  const location = useLocation();
  const locationState = location.state as RequireAuthLocationState | undefined;
  const navigatedFrom = locationState?.from.pathname ?? '/';

  const onSubmit = async (values: LoginForm) => {
    setFormError(undefined);
    const result = await authenticate(values.email, values.password);

    if (!result.ok) {
      return setFormError(result.error);
    }

    logIn(result.data.accessToken);

    return undefined;
  };

  if (accessToken) {
    return <Navigate to={navigatedFrom} replace />;
  }

  if (error) {
    return (
      <Container component="main" maxWidth="sm">
        <Flex width="100%" height="100vh" alignItems="center">
          <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
            <GeneralAPIError />
          </Paper>
        </Flex>
      </Container>
    );
  }

  const isLoading = data === undefined;

  return (
    <Container component="main" maxWidth="sm">
      <Flex width="100%" height="100vh" alignItems="center">
        <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
          <LoginLoaderWrapper
            aria-hidden={!isLoading}
            className={!isLoading ? 'hidden' : undefined}
          >
            <FullPageLoading />
          </LoginLoaderWrapper>
          <LoginHiddenWrapper
            aria-hidden={isLoading}
            className={isLoading ? 'hidden' : undefined}
          >
            <Box p="2rem">
              <Flex justifyContent="center" alignItems="center">
                <Flex mr="1rem">
                  <Icon sx={{ fontSize: 48 }}>car_rental</Icon>
                </Flex>
                <Typography variant="h3" component="h1">
                  {oskName}
                </Typography>
              </Flex>
              <Formik<LoginForm>
                initialValues={{
                  email: '',
                  password: '',
                }}
                validationSchema={LoginFormSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <Flex flexDirection="column" mt="0.25rem">
                      <FTextField
                        name="email"
                        label="Email"
                        margin="normal"
                        required
                        disabled={isLoading}
                      />
                      <FTextField
                        name="password"
                        label="Hasło"
                        type="password"
                        margin="normal"
                        required
                        disabled={isLoading}
                      />
                      {formError && (
                        <Box my="0.5rem">
                          <Alert severity="error">{formError}</Alert>
                        </Box>
                      )}
                      <Flex justifyContent="space-between" mt="0.5rem">
                        <LoadingButton
                          variant="contained"
                          type="submit"
                          loading={isSubmitting}
                          disabled={isLoading}
                        >
                          Zaloguj Się
                        </LoadingButton>
                        <Button
                          variant="outlined"
                          type="button"
                          disabled={isLoading}
                        >
                          Zapisz Się na Kurs
                        </Button>
                      </Flex>
                    </Flex>
                  </Form>
                )}
              </Formik>
            </Box>
          </LoginHiddenWrapper>
        </Paper>
      </Flex>
    </Container>
  );
};
