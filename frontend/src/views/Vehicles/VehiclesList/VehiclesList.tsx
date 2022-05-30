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
import { VehicleGetAllResponseDto } from '@osk/shared';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';

export const VehiclesList = () => {
  const { data, error } = useSWR<VehicleGetAllResponseDto>('/api/vehicles');
  const navigate = useNavigate();

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const rows = data.vehicles;

  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="h1">
          Pojazdy
        </Typography>
        <Tooltip title="Filtruj listę">
          <IconButton>
            <Icon>filter_list</Icon>
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <Table aria-label="Lista Kursantów" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa</TableCell>
              <TableCell>Numer Rejestracyjny</TableCell>
              <TableCell>Data Następnego Przeglądu</TableCell>
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
                <TableCell scope="row">Nazwa</TableCell>
                <TableCell scope="row">{row.licensePlate}</TableCell>
                <TableCell scope="row">Data</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
