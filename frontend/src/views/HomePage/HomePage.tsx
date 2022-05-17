import { Typography } from '@mui/material';
import { Flex } from 'reflexbox';

export const HomePage = () => {
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
