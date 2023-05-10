import {
  Toolbar,
  Typography,
  Icon,
  TableCell,
  Breadcrumbs,
  Stack,
  Button,
  Divider,
} from '@mui/material';

import { PaymentFindAllQueryDto, PaymentFindAllResponseDto } from '@osk/shared';
import { endOfDay, formatISO, parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { Table } from '../../../components/Table/Table';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { formatCurrency } from '../../../utils/currency';
import { formatDatesRange, formatLong } from '../../../utils/date';
import { AmountTableCell } from './PaymentsList.styled';
import { theme } from '../../../theme';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import { useSort } from '../../../hooks/useSort/useSort';
import { addQueryParams } from '../../../utils/addQueryParams';
import { TableFilters } from '../../../components/Table/TableFilters';
import { TextFilter } from '../../../components/Table/Filters/TextFilter/TextFilter';
import { DateFilter } from '../../../components/Table/Filters/DateFilter/DateFilter';
import { IntegerRangeFilter } from '../../../components/Table/Filters/IntegerRangeFilter/IntegerRangeFilter';
import { LAYOUT_HEIGHT } from '../../Layout/Layout';
import { useListTotal } from '../../../hooks/useListTotal/useListTotal';

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 10000;
export const PaymentsList = () => {
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
  } = useSort<Required<PaymentFindAllQueryDto>['sortBy']>('date', 'desc');
  const { firstName, lastName, amount, date } = useFilters();
  const [openedFilter, setOpenedFilter] = useState<null | string>(null);

  const apiUrl = useMemo(
    () =>
      addQueryParams<PaymentFindAllQueryDto>('/api/payments', {
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
          firstName: firstName.value,
          lastName: lastName.value,
          amountFrom: amount.value.from,
          amountTo: amount.value.to,
        },
      }),
    [
      currentPage,
      rowsPerPage,
      sortOrder,
      sortedBy,
      firstName.value,
      lastName.value,
      date.value,
      amount.value,
    ],
  );
  const { data, error } = useSWR<PaymentFindAllResponseDto>(apiUrl);
  const rows = data?.payments;
  const totalRows = useListTotal(data?.total);
  const columnSize = '25%';

  if (error) {
    return <GeneralAPIError />;
  }

  return (
    <Flex flexDirection="column" height={LAYOUT_HEIGHT}>
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
      <Divider />
      <TableFilters
        openedFilter={openedFilter}
        setOpenedFilter={setOpenedFilter}
        filters={[
          {
            id: 'firstName',
            label: 'Imię',
            isActive: firstName.value !== undefined,
            activeLabel: firstName.value,
            clearFilter: () => firstName.set(undefined),
            renderFilter: ({ isOpen, toggle }) => (
              <TextFilter
                value={firstName.value}
                setValue={firstName.set}
                label="Imię"
                isOpen={isOpen}
                toggleOpen={toggle}
              />
            ),
          },
          {
            id: 'lastName',
            label: 'Nazwisko',
            isActive: lastName.value !== undefined,
            activeLabel: lastName.value,
            clearFilter: () => lastName.set(undefined),
            renderFilter: ({ isOpen, toggle }) => (
              <TextFilter
                value={lastName.value}
                setValue={lastName.set}
                label="Nazwisko"
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
            isActive:
              amount.value.from !== undefined && amount.value.to !== undefined,
            activeLabel: `${amount.value.from}zł - ${amount.value.to}zł`,
            clearFilter: () => amount.set({ from: undefined, to: undefined }),
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
        ariaLabel="Lista Płatności"
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
            width: columnSize,
            sortable: true,
            openFilter: () => setOpenedFilter('date'),
          },
          {
            id: 'firstName',
            name: 'Imię',
            width: columnSize,
            openFilter: () => setOpenedFilter('firstName'),
          },
          {
            id: 'lastName',
            name: 'Nazwisko',
            width: columnSize,
            openFilter: () => setOpenedFilter('lastName'),
          },
          {
            id: 'amount',
            name: 'Kwota',
            width: columnSize,
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
              <TableCell>{row.trainee.user.firstName}</TableCell>
              <TableCell>{row.trainee.user.lastName}</TableCell>
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
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [amount, setAmount] = useState<{
    from: number | undefined;
    to: number | undefined;
  }>({ from: undefined, to: undefined });

  return useMemo(
    () => ({
      firstName: { set: setFirstName, value: firstName },
      lastName: { set: setLastName, value: lastName },
      amount: { set: setAmount, value: amount },
      date: {
        set: (from: Date | undefined, to: Date | undefined) => {
          setDate({ from, to });
        },
        value: date,
      },
    }),
    [firstName, lastName, amount, date],
  );
};
