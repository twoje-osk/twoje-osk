import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Button,
  Container,
  Icon,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex } from 'reflexbox';
import { FTextField } from '../../components/FTextField/FTextField';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useUnauthorizedOrganizationData } from '../../hooks/useUnauthorizedOrganizationData/useUnauthorizedOrganizationData';
import {
  ResetPasswordForm,
  ResetPasswordFormSchema,
} from './ResetPassword.schema';
import {
  ResetPasswordHiddenWrapper,
  ResetPasswordLoaderWrapper,
} from './ResetPassword.styled';
import { sendChangePasswordRequest } from './ResetPassword.utils';

export const ResetPassword = () => {
  const { oskName, error } = useUnauthorizedOrganizationData();
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [submissionState, setSubmissionState] = useState<
    'not-sent' | 'success' | 'error'
  >('not-sent');
  const { token } = useParams();

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!token) {
      setFormError('Wystąpił błąd, spróbuj ponownie później');
      return undefined;
    }

    setFormError(undefined);
    const result = await sendChangePasswordRequest(values.password, token);

    if (result.ok) {
      setSubmissionState('success');
      return undefined;
    }

    if (result.error.type === 'TOKEN_NOT_FOUND') {
      setSubmissionState('error');
    }

    return setFormError(result.error.message);
  };

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

  const header = (
    <Flex justifyContent="center" alignItems="center">
      <Flex mr="1rem">
        <Icon sx={{ fontSize: 48 }}>car_rental</Icon>
      </Flex>
      <Typography variant="h3" component="h1">
        {oskName}
      </Typography>
    </Flex>
  );

  if (submissionState === 'success') {
    return (
      <Container component="main" maxWidth="sm">
        <Flex width="100%" height="100vh" alignItems="center">
          <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
            <Box p="2rem">
              {header}
              <Box marginY="1rem">
                <Alert severity="success">Pomyślnie zmieniono hasło</Alert>
              </Box>
              <Button variant="outlined" component={RouterLink} to="/">
                Wróć do logowania
              </Button>
            </Box>
          </Paper>
        </Flex>
      </Container>
    );
  }

  if (submissionState === 'error') {
    return (
      <Container component="main" maxWidth="sm">
        <Flex width="100%" height="100vh" alignItems="center">
          <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
            <Box p="2rem">
              {header}
              <Box marginY="1rem">
                <Alert severity="error">
                  <AlertTitle>
                    Linku do resetu hasła jest nieprawidłowy
                  </AlertTitle>
                  Jeśli uważasz że jest to błąd, wyślij e-maila na{' '}
                  <Link
                    href="mailto:support@twoje-osk.pl"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    support@twoje-osk.pl
                  </Link>
                </Alert>
              </Box>
              <Button variant="outlined" component={RouterLink} to="/">
                Wróć do logowania
              </Button>
            </Box>
          </Paper>
        </Flex>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Flex width="100%" height="100vh" alignItems="center">
        <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
          <ResetPasswordLoaderWrapper
            aria-hidden={!isLoading}
            className={!isLoading ? 'hidden' : undefined}
          >
            <FullPageLoading />
          </ResetPasswordLoaderWrapper>
          <ResetPasswordHiddenWrapper
            aria-hidden={isLoading}
            className={isLoading ? 'hidden' : undefined}
          >
            <Box p="2rem">
              {header}
              <Typography variant="h6" marginTop="1rem">
                Ustaw nowe hasło
              </Typography>
              <Formik<ResetPasswordForm>
                initialValues={{
                  password: '',
                }}
                validationSchema={ResetPasswordFormSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <Flex flexDirection="column">
                      <FTextField
                        name="password"
                        label="Nowe hasło"
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
                          Zmień Hasło
                        </LoadingButton>
                        <Button
                          variant="outlined"
                          disabled={isLoading}
                          component={RouterLink}
                          to="/"
                        >
                          Wróć do logowania
                        </Button>
                      </Flex>
                    </Flex>
                  </Form>
                )}
              </Formik>
            </Box>
          </ResetPasswordHiddenWrapper>
        </Paper>
      </Flex>
    </Container>
  );
};
