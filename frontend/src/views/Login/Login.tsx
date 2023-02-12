import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Container,
  Icon,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Box, Flex } from 'reflexbox';
import { FTextField } from '../../components/FTextField/FTextField';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { RequireAuthLocationState } from '../../components/RequireAuth/RequireAuth';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { useUnauthorizedOrganizationData } from '../../hooks/useUnauthorizedOrganizationData/useUnauthorizedOrganizationData';
import { LoginForm, LoginFormSchema } from './Login.schema';
import { authenticate } from './Login.utils';
import {
  UnauthenticatedViewHiddenWrapper,
  UnauthenticatedViewLoaderWrapper,
} from '../../components/UnauthenticatedView/UnauthenticatedView.styled';

export const Login = () => {
  const { oskName, error } = useUnauthorizedOrganizationData();
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

  const isLoading = oskName === undefined;

  return (
    <Container component="main" maxWidth="sm">
      <Flex width="100%" height="100vh" alignItems="center">
        <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
          <UnauthenticatedViewLoaderWrapper
            aria-hidden={!isLoading}
            className={!isLoading ? 'hidden' : undefined}
          >
            <FullPageLoading />
          </UnauthenticatedViewLoaderWrapper>
          <UnauthenticatedViewHiddenWrapper
            aria-hidden={isLoading}
            className={isLoading ? 'hidden' : undefined}
          >
            <Box p="2rem">
              <Flex justifyContent="center" alignItems="center">
                <Flex mr="1rem">
                  <Icon sx={{ fontSize: 48 }}>car_rental</Icon>
                </Flex>
                <Typography variant="h3" component="h1">
                  {oskName} #1
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
                      <Link
                        component={RouterLink}
                        to="/account/zapomnialem-haslo"
                        marginBottom="0.5rem"
                      >
                        Nie pamiętasz hasła?
                      </Link>
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
                          component={RouterLink}
                          to="/zapisz-sie"
                        >
                          Zapisz Się na Kurs
                        </Button>
                      </Flex>
                    </Flex>
                  </Form>
                )}
              </Formik>
            </Box>
          </UnauthenticatedViewHiddenWrapper>
        </Paper>
      </Flex>
    </Container>
  );
};
