import {
  Toolbar,
  Typography,
  Stack,
  Button,
  Icon,
  TableCell,
  Divider,
} from '@mui/material';
import {
  DriversLicenseCategoryFindAllResponseDto,
  MockExamAttemptFindAllQueryDto,
  MockExamAttemptFindAllResponseDto,
} from '@osk/shared';
import { endOfDay, formatISO, parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { formatDatesRange, formatLong } from '../../../utils/date';
import { PERFECT_SCORE } from '../MockExams.constants';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import { useSort } from '../../../hooks/useSort/useSort';
import { addQueryParams } from '../../../utils/addQueryParams';
import { TableFilters } from '../../../components/Table/TableFilters';
import { Table } from '../../../components/Table/Table';
import { DateFilter } from '../../../components/Table/Filters/DateFilter/DateFilter';
import { IntegerRangeFilter } from '../../../components/Table/Filters/IntegerRangeFilter/IntegerRangeFilter';
import { BooleanFilter } from '../../../components/Table/Filters/BooleanFilter/BooleanFilter';
import { useListTotal } from '../../../hooks/useListTotal/useListTotal';
import { LAYOUT_HEIGHT } from '../../Layout/Layout';
import { PicklistFilter } from '../../../components/Table/Filters/PicklistFilter/PicklistFilter';
import { PicklistOption } from '../../../components/FPicklistField/FPicklistField';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';

const MIN_SCORE = 0;
export const MockExamsList = () => {
  const pageTitle = 'Próbne egzaminy teoretyczne';
  const { rowsPerPage, currentPage, onPageChange, onRowsPerPageChange } =
    usePagination();
  const {
    sortOrder,
    sortedBy,
    getCellSortDirection,
    getLabelIsActive,
    getLabelSortDirection,
    onSortClick,
  } = useSort<Required<MockExamAttemptFindAllQueryDto>['sortBy']>(
    'attemptDate',
    'desc',
  );
  const { isPassed, score, date, category } = useFilters();
  const [openedFilter, setOpenedFilter] = useState<null | string>(null);

  const apiUrl = useMemo(
    () =>
      addQueryParams<MockExamAttemptFindAllQueryDto>('/api/exams', {
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
          isPassed: isPassed.value,
          scoreFrom: score.value.from,
          scoreTo: score.value.to,
          categoryId: category.value,
        },
      }),
    [
      currentPage,
      rowsPerPage,
      sortOrder,
      sortedBy,
      date.value,
      score.value,
      isPassed.value,
      category.value,
    ],
  );
  const { data: mockExamsListData, error: mockExamsListError } =
    useSWR<MockExamAttemptFindAllResponseDto>(apiUrl);
  const { data: categoriesData, error: categoriesError } =
    useSWR<DriversLicenseCategoryFindAllResponseDto>(
      '/api/drivers-license-categories',
    );
  const navigate = useNavigate();
  const examAttempts = mockExamsListData?.examAttempts;
  const totalRows = useListTotal(mockExamsListData?.total);

  if (mockExamsListError || categoriesError) {
    return <GeneralAPIError />;
  }

  if (categoriesData === undefined) {
    return <FullPageLoading />;
  }

  const categoriesOptions: PicklistOption[] = [];
  categoriesData.categories.forEach((cat) => {
    categoriesOptions.push({ value: cat.id, label: cat.name });
  });

  return (
    <Flex flexDirection="column" height={LAYOUT_HEIGHT}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" component="h1">
          {pageTitle}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            component={Link}
            to="nowy"
          >
            Rozwiąż próbny egzamin teoretyczny
          </Button>
        </Stack>
      </Toolbar>
      <Divider />
      <TableFilters
        openedFilter={openedFilter}
        setOpenedFilter={setOpenedFilter}
        filters={[
          {
            id: 'isPassed',
            label: 'Wynik',
            isActive: isPassed.value !== undefined,
            activeLabel: isPassed.value ? 'Pozytywny' : 'Negatywny',
            clearFilter: () => isPassed.set(undefined),
            renderFilter: ({ toggle }) => (
              <BooleanFilter
                trueLabel="Pozytywny"
                falseLabel="Negatywny"
                value={isPassed.value}
                setValue={isPassed.set}
                toggleOpen={toggle}
              />
            ),
          },
          {
            id: 'category',
            label: 'Kategoria',
            isActive: category.value !== undefined,
            activeLabel: categoriesOptions.find(
              (option) => option.value === category.value,
            )?.label,
            clearFilter: () => category.set(undefined),
            renderFilter: ({ toggle }) => (
              <PicklistFilter
                value={category.value}
                setValue={category.set}
                toggleOpen={toggle}
                options={categoriesOptions}
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
            id: 'score',
            label: 'Punktacja',
            isActive:
              score.value.from !== undefined && score.value.to !== undefined,
            activeLabel: `${score.value.from}pkt - ${score.value.to}pkt`,
            clearFilter: () => score.set({ from: undefined, to: undefined }),
            renderFilter: () => (
              <IntegerRangeFilter
                label="Punktacja"
                setValue={score.set}
                min={MIN_SCORE}
                max={PERFECT_SCORE}
              />
            ),
          },
        ]}
      />
      <Table
        ariaLabel="Lista próbnych egzaminów"
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
            id: 'icon',
            name: '',
            width: '56px',
            sortable: false,
          },
          {
            id: 'isPassed',
            name: 'Wynik',
            width: '30%',
            openFilter: () => setOpenedFilter('isPassed'),
            sortable: true,
          },
          {
            id: 'category',
            name: 'Kategoria',
            width: '25%',
            openFilter: () => setOpenedFilter('category'),
            sortable: false,
          },
          {
            id: 'score',
            name: 'Punktacja',
            width: '25%',
            openFilter: () => setOpenedFilter('score'),
            sortable: true,
          },
          {
            id: 'attemptDate',
            name: 'Data',
            width: '25%',
            sortable: true,
            openFilter: () => setOpenedFilter('date'),
          },
        ]}
        rows={examAttempts}
        onRowClick={(row) => navigate(`./${row.id}`)}
        renderRowCells={(mockExam) => {
          return (
            <>
              <TableCell align="center">
                {mockExam.isPassed ? (
                  <Icon color="success">check</Icon>
                ) : (
                  <Icon color="error">close</Icon>
                )}
              </TableCell>
              <TableCell>
                {mockExam.isPassed ? 'Pozytywny' : 'Negatywny'}
              </TableCell>
              <TableCell>Kategoria {mockExam.category.name}</TableCell>
              <TableCell>
                {mockExam.score}/{PERFECT_SCORE}
              </TableCell>
              <TableCell>
                {formatLong(parseISO(mockExam.attemptDate))}
              </TableCell>
            </>
          );
        }}
      />
    </Flex>
  );
};

const useFilters = () => {
  const [isPassed, setIsPassed] = useState<boolean | undefined>();
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [score, setScore] = useState<{
    from: number | undefined;
    to: number | undefined;
  }>({ from: undefined, to: undefined });
  const [category, setCategory] = useState<number | undefined>();

  return useMemo(
    () => ({
      isPassed: { set: setIsPassed, value: isPassed },
      score: { set: setScore, value: score },
      date: {
        set: (from: Date | undefined, to: Date | undefined) => {
          setDate({ from, to });
        },
        value: date,
      },
      category: {
        set: setCategory,
        value: category,
      },
    }),
    [category, isPassed, score, date],
  );
};
