import { Typography } from '@mui/material';
import { TraineeFindAllResponseDto } from '@osk/shared';
import { useEffect } from 'react';
import { Flex } from 'reflexbox';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';

export const HomePage = () => {
  const makeRequest = useMakeRequestWithAuth();

  // eslint-disable-next-line no-warning-comments
  // TODO: Use [useSwr](https://swr.vercel.app/docs/getting-started)
  useEffect(() => {
    makeRequest<TraineeFindAllResponseDto>('/api/trainees').then(console.log);
  }, [makeRequest]);

  return (
    <Flex
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h4">Witaj na stronie domowej!</Typography>
    </Flex>
  );
};
