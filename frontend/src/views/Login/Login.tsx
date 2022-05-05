import { Button, Container, Icon, Paper, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { Box, Flex } from 'reflexbox';
import { FTextField } from '../../components/FTextField/FTextField';
import { LoginForm } from './Login.types';
import { LoginFormSchema } from './Login.utils';

export const Login = () => {
  const oskName = 'OSK Adam Nowak';

  const onSubmit = () => undefined;

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
                  <Flex justifyContent="space-between" mt="1rem">
                    <Button variant="contained" type="submit">
                      Zaloguj Się
                    </Button>
                    <Button variant="outlined" type="button">
                      Zapisz Się na Kurs
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </Formik>
          </Box>
        </Paper>
      </Flex>
    </Container>
  );
};
