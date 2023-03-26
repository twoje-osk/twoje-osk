import {
  Toolbar,
  Typography,
  Stack,
  Button,
  Icon,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Breadcrumbs,
  Link as MUILink,
} from '@mui/material';
import {
  PaymentFindAllByTraineeResponseDto,
  TraineeFindOneResponseDto,
} from '@osk/shared';
import { parseISO } from 'date-fns';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { formatCurrency } from '../../../utils/currency';
import { formatLong } from '../../../utils/date';
import { AmountTableCell } from './TraineePayments.styled';
import { theme } from '../../../theme';

export const TraineePayments = () => {
  const { traineeId } = useParams();
  const navigate = useNavigate();
  const { data, error } = useSWR<PaymentFindAllByTraineeResponseDto>(
    traineeId ? `/api/payments/trainees/${traineeId}` : null,
  );
  const { data: traineeData, error: traineeError } =
    useSWR<TraineeFindOneResponseDto>(
      traineeId ? `/api/trainees/${traineeId}` : null,
    );

  if (error || traineeError) {
    return <GeneralAPIError />;
  }

  if (data === undefined || traineeData === undefined) {
    return <FullPageLoading />;
  }

  const rows = data.payments;
  const { trainee } = traineeData;

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
          <MUILink
            underline="hover"
            to="/kursanci"
            component={Link}
            variant="h6"
          >
            Kursanci
          </MUILink>
          <MUILink
            underline="hover"
            to={`/kursanci/${trainee.id}`}
            component={Link}
            variant="h6"
          >
            {trainee.user.firstName} {trainee.user.lastName}
          </MUILink>
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
        <Table aria-label="Lista Kursantów" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Uwaga</TableCell>
              <TableCell>Kwota</TableCell>
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
                <TableCell>{row.note}</TableCell>
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
