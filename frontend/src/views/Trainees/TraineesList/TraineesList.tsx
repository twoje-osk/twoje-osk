import {
  Button,
  Icon,
  IconButton,
  Stack,
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
import { parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { formatLong } from '../../../utils/date';

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
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" component="h1">
          Kursanci
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            component={Link}
            to="nowy"
          >
            Dodaj Nowego Kursanta
          </Button>
          <Tooltip title="Filtruj listę">
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <Table aria-label="Lista Kursantów" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Imię</TableCell>
              <TableCell>Nazwisko</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Data Dołączenia</TableCell>
              <TableCell align="center">Aktywny</TableCell>
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
                <TableCell>{row.user.firstName}</TableCell>
                <TableCell>{row.user.lastName}</TableCell>
                <TableCell>{row.user.phoneNumber}</TableCell>
                <TableCell>
                  {formatLong(parseISO(row.user.createdAt))}
                </TableCell>
                <TableCell align="center">
                  {row.user.isActive ? (
                    <Icon color="success">check</Icon>
                  ) : (
                    <Icon color="error">close</Icon>
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
