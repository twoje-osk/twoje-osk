import {
  Button,
  Icon,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { TraineeFindAllQueryDto, TraineeFindAllResponseDto } from '@osk/shared';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { Table } from '../../../components/Table/Table';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import { useSort } from '../../../hooks/useSort/useSort';
import { addQueryParams } from '../../../utils/addQueryParams';
import { formatLong } from '../../../utils/date';

export const TraineesList = () => {
  const { rowsPerPage, currentPage, onPageChange, onRowsPerPageChange } =
    usePagination();
  const {
    sortOrder,
    sortedBy,
    getCellSortDirection,
    getLabelIsActive,
    getLabelSortDirection,
    onSortClick,
  } = useSort<Required<TraineeFindAllQueryDto>['sortBy']>('firstName', 'asc');

  const apiUrl = useMemo(
    () =>
      addQueryParams<TraineeFindAllQueryDto>('/api/trainees', {
        page: currentPage,
        pageSize: rowsPerPage,
        sortOrder,
        sortBy: sortedBy,
      }),
    [currentPage, rowsPerPage, sortOrder, sortedBy],
  );

  const { data, error } = useSWR<TraineeFindAllResponseDto>(apiUrl);

  const navigate = useNavigate();

  if (error) {
    return <GeneralAPIError />;
  }

  const rows = data?.trainees;
  const totalRows = data?.total ?? 0;
  const activeColumnWidth = '116px';
  const columnSize = '25%';

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
      <Table
        ariaLabel="Lista Kursantów"
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
            id: 'firstName',
            name: 'Imię',
            width: columnSize,
          },
          {
            id: 'lastName',
            name: 'Imię',
            width: columnSize,
          },
          {
            id: 'phone',
            name: 'Telefon',
            width: columnSize,
            sortable: false,
          },
          {
            id: 'createdAt',
            name: 'Data Dołączenia',
            width: columnSize,
          },
          {
            id: 'isActive',
            name: 'Aktywny',
            width: activeColumnWidth,
          },
        ]}
        rows={rows}
        renderRow={(row) => (
          <TableRow
            hover
            key={row.id}
            onClick={() => navigate(`./${row.id}`)}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell>{row.user.firstName}</TableCell>
            <TableCell>{row.user.lastName}</TableCell>
            <TableCell>{row.user.phoneNumber}</TableCell>
            <TableCell>{formatLong(parseISO(row.user.createdAt))}</TableCell>
            <TableCell align="center">
              {row.user.isActive ? (
                <Icon color="success">check</Icon>
              ) : (
                <Icon color="error">close</Icon>
              )}
            </TableCell>
          </TableRow>
        )}
      />
    </Flex>
  );
};
