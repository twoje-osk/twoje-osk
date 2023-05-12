import { CircularProgress } from '@mui/material';
import { Flex } from 'reflexbox';
import { LAYOUT_HEIGHT } from '../../views/Layout/Layout';

export const FullPageLoading = () => {
  return (
    <Flex
      height={LAYOUT_HEIGHT}
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Flex>
  );
};
