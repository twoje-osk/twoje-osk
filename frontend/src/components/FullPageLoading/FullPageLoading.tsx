import { CircularProgress } from '@mui/material';
import { Flex } from 'reflexbox';
import { LAYOUT_HEIGHT } from '../../views/Layout/Layout';

interface FullPageLoadingProps {
  height?: string;
}
export const FullPageLoading = ({
  height = LAYOUT_HEIGHT,
}: FullPageLoadingProps) => {
  return (
    <Flex
      height={height}
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Flex>
  );
};
