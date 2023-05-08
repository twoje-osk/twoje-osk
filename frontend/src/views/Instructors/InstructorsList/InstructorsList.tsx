import {
  Typography,
  TableCell,
  Toolbar,
  Icon,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import {
  DriversLicenseCategoryFindAllResponseDto,
  InstructorFindAllResponseDto,
} from '@osk/shared';
import { useMemo, useState } from 'react';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { addQueryParams } from '../../../utils/addQueryParams';
import { useSort } from '../../../hooks/useSort/useSort';
import { BooleanFilter } from '../../../components/Table/Filters/BooleanFilter/BooleanFilter';
import { TextFilter } from '../../../components/Table/Filters/TextFilter/TextFilter';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import { TableFilters } from '../../../components/Table/TableFilters';
import { Table } from '../../../components/Table/Table';

export const InstructorsList = () => {
  const { rowsPerPage, currentPage, onPageChange, onRowsPerPageChange } =
    usePagination();
  const {
    sortOrder,
    sortedBy,
    getCellSortDirection,
    getLabelIsActive,
    getLabelSortDirection,
    onSortClick,
  } = useSort<Required<InstructorFindAllResponseDto>['sortBy']>(
    'firstName',
    'asc',
  );
  const { firstName, lastName, isActive, phoneNumber } = useFilters();
  const [openedFilter, setOpenedFilter] = useState<null | string>(null);

  const apiUrl = useMemo(
    () =>
      addQueryParams<InstructorFindAllResponseDto>('/api/instructors', {
        page: currentPage,
        pageSize: rowsPerPage,
        sortOrder,
        sortBy: sortedBy,
        filters: {
          firstName: firstName.value,
          lastName: lastName.value,
          isActive: isActive.value,
          phoneNumber: phoneNumber.value,
        },
      }),
    [
      currentPage,
      rowsPerPage,
      sortOrder,
      sortedBy,
      firstName.value,
      lastName.value,
      isActive.value,
      phoneNumber.value,
    ],
  );

  const { data: instructorsData, error: instructorsError } =
    useSWR<InstructorFindAllResponseDto>(apiUrl);
  const { data: qualificationsData, error: qualificationsError } =
    useSWR<DriversLicenseCategoryFindAllResponseDto>(
      '/api/drivers-license-categories',
    );
  const navigate = useNavigate();
  const pageTitle = 'Instruktorzy';

  if (instructorsError || qualificationsError) {
    return <GeneralAPIError />;
  }

  const rows = instructorsData?.instructors;
  const totalRows = instructorsData?.total ?? 0;
  const activeColumnWidth = '140px';
  const columnSize = '25%';

  const qualifications = Object.fromEntries(
    qualificationsData.categories.map((quali) => {
      return [quali.id, quali.name];
    }),
  );

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
          {pageTitle}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            startIcon={<Icon>add</Icon>}
            variant="contained"
            component={Link}
            to="nowy"
          >
            Dodaj Nowego Instruktora
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
            id: 'phoneNumber',
            label: 'Telefon',
            isActive: phoneNumber.value !== undefined,
            activeLabel: phoneNumber.value,
            clearFilter: () => phoneNumber.set(undefined),
            renderFilter: ({ isOpen, toggle }) => (
              <TextFilter
                value={phoneNumber.value}
                setValue={phoneNumber.set}
                label="Telefon"
                isOpen={isOpen}
                toggleOpen={toggle}
              />
            ),
          },
          {
            id: 'isActive',
            label: 'Aktywny',
            isActive: isActive.value !== undefined,
            activeLabel: isActive.value ? 'Tak' : 'Nie',
            clearFilter: () => isActive.set(undefined),
            renderFilter: ({ toggle }) => (
              <BooleanFilter
                trueLabel="Aktywny"
                falseLabel="Nieaktywny"
                value={isActive.value}
                setValue={isActive.set}
                toggleOpen={toggle}
              />
            ),
          },
        ]}
      />
      <Table
        ariaLabel="Lista Instruktorów"
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
            openFilter: () => setOpenedFilter('firstName'),
          },
          {
            id: 'lastName',
            name: 'Nazwisko',
            width: columnSize,
            openFilter: () => setOpenedFilter('lastName'),
          },
          {
            id: 'phoneNumber',
            name: 'Telefon',
            width: columnSize,
            sortable: false,
            openFilter: () => setOpenedFilter('phoneNumber'),
          },
          {
            id: 'qualifications',
            name: 'Uprawnienia',
            width: columnSize,
            sortable: false,
            openFilter: () => setOpenedFilter('qualifications'),
          },
          {
            id: 'isActive',
            name: 'Aktywny',
            width: activeColumnWidth,
            openFilter: () => setOpenedFilter('isActive'),
          },
        ]}
        onRowClick={(row) => navigate(`./${row.id}`)}
        rows={rows}
        renderRowCells={(row) => (
          <>
            <TableCell>{row.user.firstName}</TableCell>
            <TableCell>{row.user.lastName}</TableCell>
            <TableCell>{row.user.phoneNumber}</TableCell>
            <TableCell>
              {row.instructorsQualificationsIds
                .map((id) => qualifications[id.toString()])
                .join(', ')}
            </TableCell>
            <TableCell align="center">
              {row.user.isActive ? (
                <Icon color="success">check</Icon>
              ) : (
                <Icon color="error">close</Icon>
              )}
            </TableCell>
          </>
        )}
      />
    </Flex>
  );
};
const useFilters = () => {
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();

  return useMemo(
    () => ({
      firstName: { set: setFirstName, value: firstName },
      lastName: { set: setLastName, value: lastName },
      isActive: { set: setIsActive, value: isActive },
      phoneNumber: { set: setPhoneNumber, value: phoneNumber },
    }),
    [firstName, lastName, isActive, phoneNumber],
  );
};
