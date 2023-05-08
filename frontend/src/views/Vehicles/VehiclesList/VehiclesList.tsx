import styled from '@emotion/styled';
import {
  Button,
  Divider,
  Icon,
  IconButton,
  Stack,
  TableCell,
  Toolbar,
  Typography,
} from '@mui/material';
import { VehicleFindAllQueryDto, VehicleFindAllResponseDto } from '@osk/shared';
import { orange } from '@mui/material/colors';
import { UserRole } from '@osk/shared/src/types/user.types';
import { endOfDay, formatISO, parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { formatDatesRange, formatLong } from '../../../utils/date';
import { useVehicleFavourites } from './VehiclesList.hooks';
import { Table } from '../../../components/Table/Table';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import { useSort } from '../../../hooks/useSort/useSort';
import { addQueryParams } from '../../../utils/addQueryParams';
import { TableFilters } from '../../../components/Table/TableFilters';
import { TextFilter } from '../../../components/Table/Filters/TextFilter/TextFilter';
import { DateFilter } from '../../../components/Table/Filters/DateFilter/DateFilter';

export const VehiclesList = () => {
  const { rowsPerPage, currentPage, onPageChange, onRowsPerPageChange } =
    usePagination();
  const { dateOfNextCheck, licensePlate, name } = useFilters();
  const [openedFilter, setOpenedFilter] = useState<null | string>(null);
  const {
    sortOrder,
    sortedBy,
    getCellSortDirection,
    getLabelIsActive,
    getLabelSortDirection,
    onSortClick,
  } = useSort<Required<VehicleFindAllQueryDto>['sortBy']>('name', 'asc');

  const apiUrl = useMemo(
    () =>
      addQueryParams<VehicleFindAllQueryDto>('/api/vehicles', {
        page: currentPage,
        pageSize: rowsPerPage,
        sortOrder,
        sortBy: sortedBy,
        filters: {
          dateOfNextCheckFrom:
            dateOfNextCheck.value.from !== undefined
              ? formatISO(dateOfNextCheck.value.from)
              : undefined,
          dateOfNextCheckTo:
            dateOfNextCheck.value.to !== undefined
              ? formatISO(endOfDay(dateOfNextCheck.value.to))
              : undefined,
          licensePlate: licensePlate.value,
          name: name.value,
        },
      }),
    [
      currentPage,
      dateOfNextCheck.value,
      licensePlate.value,
      name.value,
      rowsPerPage,
      sortOrder,
      sortedBy,
    ],
  );

  const { data, error } = useSWR<VehicleFindAllResponseDto>(apiUrl);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isInstructor = user?.role === UserRole.Instructor;
  const {
    favouriteVehiclesIds,
    onToggleFavourite,
    isLoading: areVehicleFavouritesLoading,
  } = useVehicleFavourites();

  if (error) {
    return <GeneralAPIError />;
  }

  const rows = data?.vehicles;
  const totalRows = data?.total ?? 0;
  const columnSize = '33%';

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
          Pojazdy
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            component={Link}
            to="nowy"
          >
            Dodaj Nowy Pojazd
          </Button>
        </Stack>
      </Toolbar>

      <Divider />
      <TableFilters
        openedFilter={openedFilter}
        setOpenedFilter={setOpenedFilter}
        filters={[
          {
            id: 'name',
            label: 'Nazwa',
            isActive: name.value !== undefined,
            activeLabel: name.value,
            clearFilter: () => name.set(undefined),
            renderFilter: ({ isOpen, toggle }) => (
              <TextFilter
                value={name.value}
                setValue={name.set}
                label="Nazwa"
                isOpen={isOpen}
                toggleOpen={toggle}
              />
            ),
          },
          {
            id: 'licensePlate',
            label: 'Numer Rejestracyjny',
            isActive: licensePlate.value !== undefined,
            activeLabel: licensePlate.value,
            clearFilter: () => licensePlate.set(undefined),
            renderFilter: ({ isOpen, toggle }) => (
              <TextFilter
                value={licensePlate.value}
                setValue={licensePlate.set}
                label="Numer Rejestracyjny"
                isOpen={isOpen}
                toggleOpen={toggle}
              />
            ),
          },
          {
            id: 'dateOfNextCheck',
            label: 'Data Następnego Przeglądu',
            isActive:
              dateOfNextCheck.value.from !== undefined ||
              dateOfNextCheck.value.to !== undefined,
            activeLabel: formatDatesRange(
              dateOfNextCheck.value.from,
              dateOfNextCheck.value.to,
            ),
            clearFilter: () => dateOfNextCheck.set(undefined, undefined),
            renderFilter: ({ toggle }) => (
              <DateFilter
                valueFrom={dateOfNextCheck.value.from}
                valueTo={dateOfNextCheck.value.to}
                setValue={dateOfNextCheck.set}
                toggleOpen={toggle}
              />
            ),
          },
        ]}
      />

      <Table
        columns={[
          {
            id: 'favourite',
            name: '',
            width: isInstructor ? '72px' : '0px',
            sortable: false,
          },
          {
            id: 'name',
            name: 'Nazwa',
            width: columnSize,
            openFilter: () => setOpenedFilter('name'),
          },
          {
            id: 'licensePlate',
            name: 'Numer Rejestracyjny',
            width: columnSize,
            openFilter: () => setOpenedFilter('licensePlate'),
          },
          {
            id: 'dateOfNextCheck',
            name: 'Data Następnego Przeglądu',
            width: columnSize,
            openFilter: () => setOpenedFilter('dateOfNextCheck'),
          },
        ]}
        ariaLabel="Lista Pojazdów"
        rows={rows}
        renderRowCells={(row) => {
          const isFavourite = favouriteVehiclesIds.includes(row.id);
          return (
            <>
              {isInstructor ? (
                <TableCell
                  scope="row"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!areVehicleFavouritesLoading) {
                      onToggleFavourite(row.id, isFavourite);
                    }
                  }}
                >
                  <Flex
                    height="100%"
                    alignContent="center"
                    justifyContent="center"
                  >
                    <StarButton
                      isFavourite={isFavourite}
                      disabled={areVehicleFavouritesLoading}
                      aria-label={
                        isFavourite
                          ? 'Usuń z ulubionych'
                          : 'Dodaj do ulubionych'
                      }
                    >
                      <Icon>{isFavourite ? 'star' : 'star_outline'}</Icon>
                    </StarButton>
                  </Flex>
                </TableCell>
              ) : (
                <TableCell scope="row" />
              )}
              <TableCell scope="row">{row.name}</TableCell>
              <TableCell scope="row">{row.licensePlate}</TableCell>
              <TableCell scope="row">
                {formatLong(parseISO(row.dateOfNextCheck))}
              </TableCell>
            </>
          );
        }}
        onRowClick={(row) => navigate(`./${row.id}`)}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        getCellSortDirection={getCellSortDirection}
        getLabelIsActive={getLabelIsActive}
        getLabelSortDirection={getLabelSortDirection}
        onSortClick={onSortClick}
      />
    </Flex>
  );
};

const StarButton = styled(IconButton)<{ isFavourite: boolean }>`
  color: ${({ isFavourite }) => (isFavourite ? orange[500] : 'currentColor')};
`;

const useFilters = () => {
  const [name, setName] = useState<string | undefined>();
  const [licensePlate, setLicensePlate] = useState<string | undefined>();
  const [dateOfNextCheck, setDateOfNextCheck] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  return useMemo(
    () => ({
      name: { value: name, set: setName },
      licensePlate: { value: licensePlate, set: setLicensePlate },
      dateOfNextCheck: {
        value: dateOfNextCheck,
        set: (from: Date | undefined, to: Date | undefined) => {
          setDateOfNextCheck({ from, to });
        },
      },
    }),
    [dateOfNextCheck, licensePlate, name],
  );
};
