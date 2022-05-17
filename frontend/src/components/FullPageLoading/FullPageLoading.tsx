import { CircularProgress } from '@mui/material';
import { Flex } from 'reflexbox';

export const FullPageLoading = () => {
  return (
    <Flex
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Flex>
  );
};
