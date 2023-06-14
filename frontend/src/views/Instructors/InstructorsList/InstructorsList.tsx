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
  InstructorFindAllQueryDto,
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
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { PicklistFilter } from '../../../components/Table/Filters/PicklistFilter/PicklistFilter';
import { PicklistOption } from '../../../components/FPicklistField/FPicklistField';
import { useListTotal } from '../../../hooks/useListTotal/useListTotal';
import { LAYOUT_HEIGHT } from '../../Layout/Layout';

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
  } = useSort<Required<InstructorFindAllQueryDto>['sortBy']>('lastName', 'asc');
  const {
    firstName,
    lastName,
    isActive,
    phoneNumber,
    instructorQualifications,
  } = useFilters();
  const [openedFilter, setOpenedFilter] = useState<null | string>(null);

  const apiUrl = useMemo(
    () =>
      addQueryParams<InstructorFindAllQueryDto>('/api/instructors', {
        page: currentPage,
        pageSize: rowsPerPage,
        sortOrder,
        sortBy: sortedBy,
        filters: {
          firstName: firstName.value,
          lastName: lastName.value,
          isActive: isActive.value,
          instructorQualification: instructorQualifications.value,
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
      instructorQualifications.value,
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
  const rows = instructorsData?.instructors;
  const totalRows = useListTotal(instructorsData?.total);
  const activeColumnWidth = '140px';
  const columnSize = '25%';

  if (instructorsError || qualificationsError) {
    return <GeneralAPIError />;
  }
  if (qualificationsData === undefined) {
    return <FullPageLoading />;
  }

  const qualificationsOptions: PicklistOption[] = [];
  qualificationsData.categories.forEach((quali) => {
    qualificationsOptions.push({ value: quali.id, label: quali.name });
  });

  const qualifications = Object.fromEntries(
    qualificationsData.categories.map((quali) => {
      return [quali.id, quali.name];
    }),
  );

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
            id: 'qualifications',
            label: 'Uprawnienia',
            isActive: instructorQualifications.value !== undefined,
            activeLabel: qualificationsOptions.find(
              (option) => option.value === instructorQualifications.value,
            )?.label,
            clearFilter: () => instructorQualifications.set(undefined),
            renderFilter: ({ toggle }) => (
              <PicklistFilter
                value={instructorQualifications.value}
                setValue={instructorQualifications.set}
                toggleOpen={toggle}
                options={qualificationsOptions}
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
  const [instructorsQualification, setInstructorsQualifications] = useState<
    number | undefined
  >();
  const [isActive, setIsActive] = useState<boolean | undefined>();

  return useMemo(
    () => ({
      firstName: { set: setFirstName, value: firstName },
      lastName: { set: setLastName, value: lastName },
      phoneNumber: { set: setPhoneNumber, value: phoneNumber },
      instructorQualifications: {
        set: setInstructorsQualifications,
        value: instructorsQualification,
      },
      isActive: { set: setIsActive, value: isActive },
    }),
    [firstName, lastName, isActive, phoneNumber, instructorsQualification],
  );
};
