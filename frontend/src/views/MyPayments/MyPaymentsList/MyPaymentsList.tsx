import {
  Toolbar,
  Typography,
  Icon,
  TableCell,
  Breadcrumbs,
  Divider,
} from '@mui/material';
import {
  PaymentFindAllByTraineeResponseDto,
  PaymentFindAllQueryDto,
} from '@osk/shared';
import { endOfDay, formatISO, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { formatCurrency } from '../../../utils/currency';
import { formatDatesRange, formatLong } from '../../../utils/date';
import { AmountTableCell } from './MyPaymentsList.styled';
import { theme } from '../../../theme';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import { useSort } from '../../../hooks/useSort/useSort';
import { addQueryParams } from '../../../utils/addQueryParams';
import { Table } from '../../../components/Table/Table';
import { TableFilters } from '../../../components/Table/TableFilters';
import { TextFilter } from '../../../components/Table/Filters/TextFilter/TextFilter';
import { DateFilter } from '../../../components/Table/Filters/DateFilter/DateFilter';
import { IntegerRangeFilter } from '../../../components/Table/Filters/IntegerRangeFilter/IntegerRangeFilter';
import { LAYOUT_HEIGHT } from '../../Layout/Layout';
import { useListTotal } from '../../../hooks/useListTotal/useListTotal';

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 10000;
export const MyPaymentsList = () => {
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
  const { note, amount, date } = useFilters();
  const [openedFilter, setOpenedFilter] = useState<null | string>(null);

  const apiUrl = useMemo(
    () =>
      addQueryParams<PaymentFindAllQueryDto>(`/api/payments/my`, {
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
      }),
    [
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
  const rows = data?.payments;
  const totalRows = useListTotal(data?.total);

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
                style={{
                  color: row.note.trim()
                    ? theme.palette.text.primary
                    : theme.palette.text.disabled,
                }}
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
    from: number | undefined;
    to: number | undefined;
  }>({ from: undefined, to: undefined });

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
