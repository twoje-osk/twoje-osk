import { Alert, AlertTitle } from '@mui/material';
import { Flex } from 'reflexbox';

export const GeneralAPIError = () => {
  return (
    <Flex p="32px" width="100%" height="100%" flexDirection="column">
      <Alert severity="error">
        <AlertTitle>Wystąpił błąd</AlertTitle>
        Prosimy spróbuj ponownie później
      </Alert>
    </Flex>
  );
};
