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
import useSwr from 'swr';
import { LONG_DATE } from '../../../constants/dateFormats';

export const TraineesList = () => {
  const { data, error } = useSwr<TraineeFindAllResponseDto>('/api/trainees');
  const navigate = useNavigate();

  if (error) {
    return <div>Error</div>;
  }

  if (data === undefined) {
    return <div>Loading</div>;
  }

  const rows = data.trainees;

  return (
    <div>
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
          component="div"
        >
          Kursanci
        </Typography>
        <Tooltip title="Filter list">
          <IconButton>
            <Icon>filter_list</Icon>
          </IconButton>
        </Tooltip>
      </Toolbar>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                    parseISO(row.user.createdAt as unknown as string),
                    LONG_DATE,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
