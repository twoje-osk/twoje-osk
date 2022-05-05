import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Container,
  Icon,
  Paper,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Flex } from 'reflexbox';
import { FTextField } from '../../components/FTextField/FTextField';
import { RequireAuthLocationState } from '../../components/RequireAuth/RequireAuth';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { LoginForm } from './Login.types';
import { authenticate, LoginFormSchema } from './Login.utils';

export const Login = () => {
  const oskName = 'OSK Adam Nowak';
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

  return (
    <Container component="main" maxWidth="sm">
      <Flex width="100%" height="100vh" alignItems="center">
        <Paper sx={{ width: '100%' }} elevation={2}>
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
                    />
                    <FTextField
                      name="password"
                      label="Hasło"
                      type="password"
                      margin="normal"
                      required
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
                      >
                        Zaloguj Się
                      </LoadingButton>
                      <Button variant="outlined" type="button">
                        Zapisz Się na Kurs
                      </Button>
                    </Flex>
                  </Flex>
                </Form>
              )}
            </Formik>
          </Box>
        </Paper>
      </Flex>
    </Container>
  );
};
