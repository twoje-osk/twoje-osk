import {
  Toolbar,
  Typography,
  Stack,
  Button,
  Icon,
  TableCell,
  Breadcrumbs,
  Link as MUILink,
  Divider,
} from '@mui/material';
import {
  PaymentFindAllByTraineeResponseDto,
  PaymentFindAllQueryDto,
  TraineeFindOneResponseDto,
} from '@osk/shared';

import { endOfDay, formatISO, parseISO } from 'date-fns';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { Table } from '../../../../components/Table/Table';
import { FullPageLoading } from '../../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../../components/GeneralAPIError/GeneralAPIError';
import { formatCurrency } from '../../../../utils/currency';
import { formatDatesRange, formatLong } from '../../../../utils/date';
import { theme } from '../../../../theme';
import { AmountTableCell } from './TraineePaymentsList.styled';
import { usePagination } from '../../../../hooks/usePagination/usePagination';
import { useSort } from '../../../../hooks/useSort/useSort';
import { addQueryParams } from '../../../../utils/addQueryParams';
import { TableFilters } from '../../../../components/Table/TableFilters';
import { TextFilter } from '../../../../components/Table/Filters/TextFilter/TextFilter';
import { DateFilter } from '../../../../components/Table/Filters/DateFilter/DateFilter';
import { IntegerRangeFilter } from '../../../../components/Table/Filters/IntegerRangeFilter/IntegerRangeFilter';

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 10000;
export const TraineePaymentsList = () => {
  const { traineeId } = useParams();
  const navigate = useNavigate();
  const { rowsPerPage, currentPage, onPageChange, onRowsPerPageChange } =
    usePagination();
  const {
    sortOrder,
    sortedBy,
    getCellSortDirection,
    getLabelIsActive,
    getLabelSortDirection,
    onSortClick,
  } = useSort<Required<PaymentFindAllQueryDto>['sortBy']>('date', 'asc');
  const { note, amount, date } = useFilters();
  const [openedFilter, setOpenedFilter] = useState<null | string>(null);

  const apiUrl = useMemo(
    () =>
      addQueryParams<PaymentFindAllQueryDto>(
        `/api/payments/trainees/${traineeId}`,
        {
          page: currentPage,
          pageSize: rowsPerPage,
          sortOrder,
          sortBy: sortedBy,
          filters: {
            dateFrom:
              date.value.from !== undefined
                ? formatISO(date.value.from)
                : undefined,
            dateTo:
              date.value.to !== undefined
                ? formatISO(endOfDay(date.value.to))
                : undefined,
            note: note.value,
            amountFrom: amount.value.from,
            amountTo: amount.value.to,
          },
        },
      ),
    [
      traineeId,
      currentPage,
      rowsPerPage,
      sortOrder,
      sortedBy,
      note.value,
      date.value,
      amount.value,
    ],
  );
  const { data, error } = useSWR<PaymentFindAllByTraineeResponseDto>(apiUrl);
  const { data: traineeData, error: traineeError } =
    useSWR<TraineeFindOneResponseDto>(
      traineeId ? `/api/trainees/${traineeId}` : null,
    );

  if (error || traineeError) {
    return <GeneralAPIError />;
  }

  if (traineeData === undefined) {
    return <FullPageLoading />;
  }

  const rows = data?.payments;
  const totalRows = data?.total ?? 0;
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
      <Divider />
      <TableFilters
        openedFilter={openedFilter}
        setOpenedFilter={setOpenedFilter}
        filters={[
          {
            id: 'note',
            label: 'Uwagi',
            isActive: note.value !== undefined,
            activeLabel: note.value,
            clearFilter: () => note.set(undefined),
            renderFilter: ({ isOpen, toggle }) => (
              <TextFilter
                value={note.value}
                setValue={note.set}
                label="Uwagi"
                isOpen={isOpen}
                toggleOpen={toggle}
              />
            ),
          },
          {
            id: 'date',
            label: 'Data',
            isActive:
              date.value.from !== undefined || date.value.to !== undefined,
            activeLabel: formatDatesRange(date.value.from, date.value.to),
            clearFilter: () => date.set(undefined, undefined),
            renderFilter: ({ toggle }) => (
              <DateFilter
                valueFrom={date.value.from}
                valueTo={date.value.to}
                setValue={date.set}
                toggleOpen={toggle}
              />
            ),
          },
          {
            id: 'amount',
            label: 'Kwota',
            isActive: true,
            activeLabel: `${amount.value.from}zł - ${amount.value.to}zł`,
            clearFilter: () => amount.set({ from: MIN_AMOUNT, to: MAX_AMOUNT }),
            renderFilter: () => (
              <IntegerRangeFilter
                label="Kwota"
                setValue={amount.set}
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
              />
            ),
          },
        ]}
      />
      <Table
        ariaLabel="Lista Płatności Kursanta"
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        getCellSortDirection={getCellSortDirection}
        getLabelIsActive={getLabelIsActive}
        getLabelSortDirection={getLabelSortDirection}
        onSortClick={onSortClick}
        columns={[
          {
            id: 'date',
            name: 'Data',
            width: '20%',
            sortable: true,
            openFilter: () => setOpenedFilter('date'),
          },
          {
            id: 'note',
            name: 'Uwagi',
            width: '60%',
            openFilter: () => setOpenedFilter('note'),
          },
          {
            id: 'amount',
            name: 'Kwota',
            width: '20%',
            sortable: true,
            openFilter: () => setOpenedFilter('amount'),
          },
        ]}
        rows={rows}
        onRowClick={(row) => navigate(`./${row.id}`)}
        renderRowCells={(row) => {
          return (
            <>
              <TableCell>{formatLong(parseISO(row.date))}</TableCell>
              <TableCell
                style={{ color: row.note.trim() ? 'black' : 'lightgrey' }}
              >
                {row.note.trim() || 'Brak'}
              </TableCell>
              <AmountTableCell align="right">
                {formatCurrency(row.amount)}
              </AmountTableCell>
            </>
          );
        }}
      />
    </Flex>
  );
};

const useFilters = () => {
  const [note, setNote] = useState<string | undefined>();
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [amount, setAmount] = useState<{
    from: number;
    to: number;
  }>({ from: MIN_AMOUNT, to: MAX_AMOUNT });

  return useMemo(
    () => ({
      note: { set: setNote, value: note },
      amount: { set: setAmount, value: amount },
      date: {
        set: (from: Date | undefined, to: Date | undefined) => {
          setDate({ from, to });
        },
        value: date,
      },
    }),
    [note, amount, date],
  );
};
