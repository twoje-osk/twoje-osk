import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Container,
  Icon,
  Paper,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex } from 'reflexbox';
import { FTextField } from '../../components/FTextField/FTextField';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import {
  UnauthenticatedViewHiddenWrapper,
  UnauthenticatedViewLoaderWrapper,
} from '../../components/UnauthenticatedView/UnauthenticatedView.styled';
import { useUnauthorizedOrganizationData } from '../../hooks/useUnauthorizedOrganizationData/useUnauthorizedOrganizationData';
import {
  ForgotPasswordForm,
  ForgotPasswordFormSchema,
} from './ForgotPassword.schema';
import { sendResetRequest } from './ForgotPassword.utils';

export const ForgotPassword = () => {
  const { oskName, error } = useUnauthorizedOrganizationData();
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  const onSubmit = async (values: ForgotPasswordForm) => {
    setFormError(undefined);
    const result = await sendResetRequest(values.email);

    if (!result.ok) {
      return setFormError(result.error);
    }

    setWasSubmitted(true);
    return undefined;
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

  if (wasSubmitted) {
    return (
      <Container component="main" maxWidth="sm">
        <Flex width="100%" height="100vh" alignItems="center">
          <Paper sx={{ width: '100%', position: 'relative' }} elevation={2}>
            <Box p="2rem">
              {header}
              <Box marginY="1rem">
                <Alert severity="success">
                  Na przypisany do Twojego konta adres e-mail wysłaliśmy
                  instrukcję dalszego postępowania.
                </Alert>
              </Box>
              <Button variant="outlined" component={Link} to="/">
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
              {header}
              <Typography marginTop="1rem" color={grey[700]} align="center">
                Podaj adres e-mail konta, do którego chcesz odzyskać dostęp.
              </Typography>
              <Formik<ForgotPasswordForm>
                initialValues={{
                  email: '',
                }}
                validationSchema={ForgotPasswordFormSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <Flex flexDirection="column">
                      <FTextField
                        name="email"
                        label="Email"
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
                          Przypomnij Hasło
                        </LoadingButton>
                        <Button
                          variant="outlined"
                          disabled={isLoading}
                          component={Link}
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
          </UnauthenticatedViewHiddenWrapper>
        </Paper>
      </Flex>
    </Container>
  );
};
