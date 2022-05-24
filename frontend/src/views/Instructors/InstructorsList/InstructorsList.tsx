import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { InstructorFindAllResponseDto } from '@osk/shared';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';

export const InstructorsList = () => {
  const { data, error } =
    useSWR<InstructorFindAllResponseDto>('/api/instructors');
  // const navigate = useNavigate();
  const pageTitle = 'Instruktorzy';

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const rows = data.instructors;

  return (
    <Box p="2rem">
      <Typography variant="h5" component="h1">
        {pageTitle}
      </Typography>
      <Flex justifyContent="center" mb="1.5rem">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imię i nazwisko</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Telefon</TableCell>
              <TableCell align="right">Samochód</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {`${row.user.firstName} ${row.user.lastName}`}
                </TableCell>
                <TableCell align="right">{row.user.email}</TableCell>
                <TableCell align="right">{row.user.phoneNumber}</TableCell>
                <TableCell align="right" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Flex>
    </Box>
  );
};
