import {
  Breadcrumbs,
  Button,
  Icon,
  Link as MUILink,
  Toolbar,
  Typography,
} from '@mui/material';
import { TraineeFindOneResponseDto } from '@osk/shared';
import { format, parseISO } from 'date-fns';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { LONG_DATE } from '../../../constants/dateFormats';
import { theme } from '../../../theme';

export const TraineeDetails = () => {
  const { traineeId } = useParams();
  const { data, error } = useSWR<TraineeFindOneResponseDto>(
    traineeId ? `/api/trainees/${traineeId}` : null,
  );

  if (traineeId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const { trainee } = data;

  return (
    <div>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
          <MUILink
            underline="hover"
            to="/kursanci"
            component={Link}
            variant="h6"
          >
            Kursanci
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {trainee.user.firstName} {trainee.user.lastName}
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <Typography variant="h3" component="h1">
          {trainee.user.firstName} {trainee.user.lastName}
        </Typography>
        <Typography variant="h6" component="h2">
          Telefon
        </Typography>
        <div>{trainee.user.phoneNumber}</div>
        <Typography variant="h6" component="h2">
          Email
        </Typography>
        <div>{trainee.user.email}</div>
        <Typography variant="h6" component="h2">
          Numer Dowodu Osobistego
        </Typography>
        <div>{trainee.driversLicenseNumber ?? 'Brak'}</div>
        <Typography variant="h6" component="h2">
          Data Dołączenia
        </Typography>
        <div>
          {format(
            // @ts-expect-error
            parseISO(trainee.user.createdAt),
            LONG_DATE,
          )}
        </div>
        <Typography variant="h6" component="h2">
          PESEL
        </Typography>
        <div>{trainee.pesel}</div>
        <Typography variant="h5" component="h2">
          PKK
        </Typography>
        <Typography variant="h6" component="h3">
          Numer
        </Typography>
        <div>{trainee.pkk}</div>
        <Button variant="contained">Zobacz Raport Postępów</Button>
      </Box>
    </div>
  );
};
