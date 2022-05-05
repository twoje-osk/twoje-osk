import { Button, Container, Paper } from '@mui/material';
import { TraineeFindAllResponseDto } from '@osk/shared';
import { useEffect } from 'react';
import { Flex } from 'reflexbox';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';

export const HomePage = () => {
  const { logOut } = useAuth();
  const makeRequest = useMakeRequestWithAuth();

  // eslint-disable-next-line no-warning-comments
  // TODO: Use [useSwr](https://swr.vercel.app/docs/getting-started)
  useEffect(() => {
    makeRequest<TraineeFindAllResponseDto>('/api/trainees').then(console.log);
  }, [makeRequest]);

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
