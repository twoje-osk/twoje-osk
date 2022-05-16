import {
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { TraineeFindAllResponseDto } from '@osk/shared';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { LONG_DATE } from '../../../constants/dateFormats';

export const TraineesList = () => {
  const { data, error } = useSWR<TraineeFindAllResponseDto>('/api/trainees');
  const navigate = useNavigate();

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const rows = data.trainees;

  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="h1"
        >
          Kursanci
        </Typography>
        <Tooltip title="Filter list">
          <IconButton>
            <Icon>filter_list</Icon>
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <Table aria-label="Lista Kursantów" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Imię</TableCell>
              <TableCell>Nazwisko</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Data Dołączenia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                hover
                key={row.id}
                onClick={() => navigate(`./${row.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">
                  {row.user.firstName}
                </TableCell>
                <TableCell>{row.user.lastName}</TableCell>
                <TableCell>{row.user.phoneNumber}</TableCell>
                {/* TODO: Typings for date */}
                <TableCell>
                  {format(
                    // @ts-expect-error
                    parseISO(row.user.createdAt),
                    LONG_DATE,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
