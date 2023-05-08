import styled from '@emotion/styled';
import {
  Button,
  Icon,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { VehicleFindAllResponseDto } from '@osk/shared';
import { orange } from '@mui/material/colors';
import { UserRole } from '@osk/shared/src/types/user.types';
import { parseISO } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { formatLong } from '../../../utils/date';
import { useVehicleFavourites } from './VehiclesList.hooks';

export const VehiclesList = () => {
  const { data, error } = useSWR<VehicleFindAllResponseDto>('/api/vehicles');
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

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const rows = data.vehicles;

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
          <Tooltip title="Filtruj listę">
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
      <TableContainer sx={{ flex: '1 1', overflow: 'auto' }}>
        <Table aria-label="Lista Kursantów" stickyHeader>
          <TableHead>
            <TableRow>
              {isInstructor && <TableCell width={40} />}
              <TableCell>Nazwa</TableCell>
              <TableCell>Numer Rejestracyjny</TableCell>
              <TableCell>Data Następnego Przeglądu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isFavourite = favouriteVehiclesIds.includes(row.id);
              return (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => navigate(`./${row.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  {isInstructor && (
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
                  )}
                  <TableCell scope="row">{row.name}</TableCell>
                  <TableCell scope="row">{row.licensePlate}</TableCell>
                  <TableCell scope="row">
                    {formatLong(parseISO(row.dateOfNextCheck))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

const StarButton = styled(IconButton)<{ isFavourite: boolean }>`
  color: ${({ isFavourite }) => (isFavourite ? orange[500] : 'currentColor')};
`;
