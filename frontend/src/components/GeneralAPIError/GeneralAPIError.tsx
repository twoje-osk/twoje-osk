import { Alert, AlertTitle } from '@mui/material';
import { Flex } from 'reflexbox';
import { LAYOUT_HEIGHT } from '../../views/Layout/Layout';

export const GeneralAPIError = () => {
  return (
    <Flex p="32px" width="100%" height={LAYOUT_HEIGHT} flexDirection="column">
      <Alert severity="error">
        <AlertTitle>Wystąpił błąd</AlertTitle>
        Prosimy spróbuj ponownie później
      </Alert>
    </Flex>
  );
};
