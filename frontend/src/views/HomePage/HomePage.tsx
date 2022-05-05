import { Button, Container, Paper } from '@mui/material';
import { Flex } from 'reflexbox';
import { useAuth } from '../../hooks/useAuth/useAuth';

export const HomePage = () => {
  const { logOut } = useAuth();

  return (
    <Container component="main" maxWidth="sm">
      <Flex width="100%" height="100vh" alignItems="center">
        <Paper sx={{ width: '100%', height: '10rem' }} elevation={2}>
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Button variant="contained" onClick={logOut}>
              Wyloguj Się
            </Button>
          </Flex>
        </Paper>
      </Flex>
    </Container>
  );
};
