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
} from '@mui/material';
import { ReactNode } from 'react';
import { LoadingTableBody } from '../LoadingTableBody/LoadingTableBody';

interface ColumnBase {
  name: string;
  width?: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

type Column<T extends string> = ColumnBase &
  (
    | {
        id: T;
        sortable?: true;
      }
    | {
        id: string;
        sortable: false;
      }
  );

interface TableProps<T, U extends string> {
  columns: Column<U>[];
  rows: T[] | undefined;
  renderRow: (data: T) => ReactNode | undefined;
  ariaLabel: string;

  getCellSortDirection?: (id: U) => SortDirection | undefined;
  getLabelIsActive?: (id: U) => boolean;
  getLabelSortDirection?: (id: U) => 'asc' | 'desc';
  onSortClick?: (id: U) => () => void;

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
export function Table<T, U extends string>({
  columns,
  rows,
  renderRow,
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
}: TableProps<T, U>) {
  return (
    <>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <MuiTable
          aria-label={ariaLabel}
          stickyHeader
          style={{ height: '100%', tableLayout: 'fixed' }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) =>
                column.sortable !== false ? (
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
                  </TableCell>
                ) : (
                  <TableCell
                    key={column.id}
                    style={{ width: column.width }}
                    align={column.align}
                  >
                    {column.name}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          {rows === undefined ? (
            <LoadingTableBody />
          ) : (
            <TableBody>{rows.map(renderRow)}</TableBody>
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
      />
    </>
  );
}
