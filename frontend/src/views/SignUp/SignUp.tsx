import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Container,
  Icon,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Box, Flex } from 'reflexbox';
import { FTextField } from '../../components/FTextField/FTextField';
import { FullPageLoading } from '../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../components/GeneralAPIError/GeneralAPIError';
import { useUnauthorizedOrganizationData } from '../../hooks/useUnauthorizedOrganizationData/useUnauthorizedOrganizationData';
import { SignUpForm, SignUpFormSchema } from './SignUp.schema';
import {
  UnauthenticatedViewHiddenWrapper,
  UnauthenticatedViewLoaderWrapper,
} from '../../components/UnauthenticatedView/UnauthenticatedView.styled';
import { submitSignUp } from './SignUp.utils';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';
import { FPasswordTextField } from '../../components/FPasswordTextField/FPasswordTextField';

export const SignUp = () => {
  const { oskName, error } = useUnauthorizedOrganizationData();
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const { showSuccessSnackbar } = useCommonSnackbars();
  const navigate = useNavigate();

  const onSubmit = async (values: SignUpForm) => {
    setFormError(undefined);
    const result = await submitSignUp(values);

    if (result.ok) {
      showSuccessSnackbar('Pomyślnie założono konto.');
      return navigate('/');
    }

    if (result.error === 'EMAIL_CONFLICT') {
      return setFormError('Użytkownik z podanym adresem email już istnieje.');
    }

    if (result.error === 'CEPIK_ERROR') {
      return setFormError(
        'Podana data urodzenia nie odpowiada danym przypisanym do podanego numeru PKK.',
      );
    }

    return setFormError(
      'Podczas tworzenia konta, wystąpił błąd. Spróbuj ponownie później.',
    );
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
                  {oskName}
                </Typography>
              </Flex>
              <Formik<SignUpForm>
                initialValues={{
                  email: '',
                  password: '',
                  phoneNumber: '',
                  dateOfBirth: null,
                  pkk: '',
                }}
                validationSchema={SignUpFormSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <Flex flexDirection="column" mt="2rem">
                      <Stack
                        spacing={2}
                        style={{ flex: 1 }}
                        justifyContent="flex-start"
                      >
                        <FTextField
                          name="email"
                          label="Email"
                          required
                          disabled={isLoading}
                        />
                        <FPasswordTextField
                          name="password"
                          label="Hasło"
                          required
                          disabled={isLoading}
                        />
                        <FTextField
                          required
                          id="phoneNumber"
                          name="phoneNumber"
                          label="Numer Telefonu"
                          disabled={isLoading}
                        />
                        <FTextField
                          required
                          id="dateOfBirth"
                          name="dateOfBirth"
                          label="Data Urodzenia"
                          type="date"
                          disabled={isLoading}
                        />
                        <FTextField
                          required
                          id="pkk"
                          name="pkk"
                          label="Numer PKK"
                          disabled={isLoading}
                        />
                      </Stack>
                      {formError && (
                        <Box my="0.5rem">
                          <Alert severity="error">{formError}</Alert>
                        </Box>
                      )}
                      <Flex justifyContent="space-between" mt="1rem">
                        <LoadingButton
                          variant="contained"
                          type="submit"
                          loading={isSubmitting}
                          disabled={isLoading}
                        >
                          Zapisz Się na Kurs
                        </LoadingButton>
                        <Button
                          variant="outlined"
                          type="button"
                          disabled={isLoading}
                          component={RouterLink}
                          to="/"
                        >
                          Zaloguj Się
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
