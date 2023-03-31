import {
  Toolbar,
  Typography,
  Icon,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Breadcrumbs,
  Stack,
  Button,
} from '@mui/material';
import { PaymentFindAllResponseDto } from '@osk/shared';
import { parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { formatCurrency } from '../../../utils/currency';
import { formatLong } from '../../../utils/date';
import { AmountTableCell } from './PaymentsList.styled';
import { theme } from '../../../theme';

export const PaymentsList = () => {
  const navigate = useNavigate();
  const { data, error } = useSWR<PaymentFindAllResponseDto>(`/api/payments`);

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const rows = data.payments;

  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          justifyContent: 'space-between',
        }}
      >
        <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
          <Typography variant="h6" color={theme.palette.text.primary}>
            Płatności
          </Typography>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            component={Link}
            to="nowa"
          >
            Dodaj Nową Płatność
          </Button>
        </Stack>
      </Toolbar>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <Table aria-label="Lista Płatności" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Kursant</TableCell>
              <TableCell align="right">Kwota</TableCell>
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
                <TableCell>{formatLong(parseISO(row.date))}</TableCell>
                <TableCell>
                  {row.trainee.user.firstName} {row.trainee.user.lastName}
                </TableCell>
                <AmountTableCell align="right">
                  {formatCurrency(row.amount)}
                </AmountTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
