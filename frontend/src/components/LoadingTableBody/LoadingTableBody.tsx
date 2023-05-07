import { TableBody, TableRow, TableCell } from '@mui/material';
import { FullPageLoading } from '../FullPageLoading/FullPageLoading';

export const LoadingTableBody = () => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={1000}>
          <FullPageLoading />
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
