import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Tooltip,
  TableContainer,
  Icon,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { InstructorFindAllResponseDto } from '@osk/shared';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';

export const InstructorsList = () => {
  const { data, error } =
    useSWR<InstructorFindAllResponseDto>('/api/instructors');
  const navigate = useNavigate();
  const pageTitle = 'Instruktorzy';

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const rows = data.instructors;

  return (
    <Flex flexDirection="column" height="100%">
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography sx={{ flex: '1 1 30%' }} variant="h6" component="h1">
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
          <Tooltip title="Filtruj listę">
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <Table aria-label="Lista Instruktorów" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Imię i Nazwisko</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Uprawnienia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                hover
                key={row.id}
                onClick={() => navigate(`./${row.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">
                  {`${row.user.firstName} ${row.user.lastName}`}
                </TableCell>
                <TableCell>{row.user.email}</TableCell>
                <TableCell>{row.user.phoneNumber}</TableCell>
                <TableCell>
                  {row.instructorsQualifications.reduce(
                    (qualifications, el) => {
                      return qualifications
                        ? `${qualifications}, ${el.name}`
                        : `${el.name}`;
                    },
                    '',
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
