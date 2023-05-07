import styled from '@emotion/styled';
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Table as MuiTable,
  SortDirection,
  TablePagination,
  IconButton,
  Icon,
  Tooltip,
} from '@mui/material';
import { ReactNode } from 'react';
import { LoadingTableBody } from '../LoadingTableBody/LoadingTableBody';

interface ColumnBase {
  name: string;
  width?: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  openFilter?: () => void;
}

type Column<TSortableId extends string> = ColumnBase &
  (
    | {
        id: TSortableId;
        sortable?: true;
      }
    | {
        id: string;
        sortable: false;
      }
  );

type IdType = string | number;
interface TableProps<TData extends { id: IdType }, TSortableId extends string> {
  columns: Column<TSortableId>[];
  rows: TData[] | undefined;
  renderRowCells: (data: TData) => ReactNode | undefined;
  onRowClick?: (data: TData) => void;
  ariaLabel: string;

  getCellSortDirection?: (id: TSortableId) => SortDirection | undefined;
  getLabelIsActive?: (id: TSortableId) => boolean;
  getLabelSortDirection?: (id: TSortableId) => 'asc' | 'desc';
  onSortClick?: (id: TSortableId) => () => void;

  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number,
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  rowsPerPageOptions?: number[];
}
// eslint-disable-next-line react/function-component-definition
export function Table<
  TData extends { id: IdType },
  TSortableId extends string,
>({
  columns,
  rows,
  renderRowCells,
  onRowClick,
  getCellSortDirection,
  getLabelIsActive,
  getLabelSortDirection,
  onSortClick,
  totalRows,
  rowsPerPage,
  currentPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions,
  ariaLabel,
}: TableProps<TData, TSortableId>) {
  return (
    <>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <MuiTable
          aria-label={ariaLabel}
          stickyHeader
          style={{
            height: rows === undefined ? '100%' : undefined,
            tableLayout: 'fixed',
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const filterIcon = column.openFilter && (
                  <Tooltip title="Filtruj">
                    <FilterIconWrapper onClick={column.openFilter}>
                      <IconButton aria-label="filtruj" size="small">
                        <Icon fontSize="inherit">filter_list</Icon>
                      </IconButton>
                    </FilterIconWrapper>
                  </Tooltip>
                );

                return column.sortable !== false ? (
                  <TableCell
                    key={column.id}
                    sortDirection={getCellSortDirection?.(column.id)}
                    style={{ width: column.width }}
                    align={column.align}
                  >
                    <TableSortLabel
                      active={getLabelIsActive?.(column.id)}
                      direction={getLabelSortDirection?.(column.id)}
                      onClick={onSortClick?.(column.id)}
                    >
                      {column.name}
                    </TableSortLabel>
                    {filterIcon}
                  </TableCell>
                ) : (
                  <TableCell
                    key={column.id}
                    style={{ width: column.width }}
                    align={column.align}
                  >
                    {column.name}
                    {filterIcon}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          {rows === undefined ? (
            <LoadingTableBody />
          ) : (
            <TableBody>
              {rows.map((row) => {
                const cell = renderRowCells(row);
                if (onRowClick !== undefined) {
                  return (
                    <TableRow
                      hover
                      key={row.id}
                      onClick={() => onRowClick(row)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {cell}
                    </TableRow>
                  );
                }

                return <TableRow key={row.id}>{cell}</TableRow>;
              })}
            </TableBody>
          )}
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions ?? [10, 25, 100]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Wierszy na stronie:"
        labelDisplayedRows={({ from, to, count }) => {
          const ofPart = count !== -1 ? count : `more than ${to}`;

          return `${from}–${to} z ${ofPart}`;
        }}
      />
    </>
  );
}

const FilterIconWrapper = styled.div`
  display: inline-flex;
  width: 24px;
  height: 24px;
  position: relative;
  vertical-align: middle;
  float: right;
  opacity: 0;
  transition: opacity 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  & > * {
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .MuiTableCell-root:hover &,
  &.isOpen {
    transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    opacity: 1;
  }
`;
