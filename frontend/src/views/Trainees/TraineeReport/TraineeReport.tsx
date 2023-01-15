import Toolbar from '@mui/material/Toolbar';
import MUILink from '@mui/material/Link';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Icon, Typography } from '@mui/material';
import useSWR from 'swr';
import { TraineeFindOneResponseDto } from '@osk/shared';
import { theme } from '../../../theme';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { Report, RowData } from '../../../components/Report/Report';

function createData(action: string, done: boolean, mastered: boolean): RowData {
  return { action, done, mastered };
}

export const REPORTS_ROWS = [
  // prettier-ignore
  createData('Przygotowanie do jazdy', false, false),
  // prettier-ignore
  createData('Ruszanie z miejsca oraz jazda pasem ruchu do przodu i do tyłu', false, false),
  // prettier-ignore
  createData('Parkowanie skośne (wjazd przodem - wyjazd tyłem)', false, false),
  // prettier-ignore
  createData('Parkowanie prostopadłe (wjazd przodem - wyjazd tyłem)', false, false),
  // prettier-ignore
  createData('Parkowanie prostopadłe (wjazd tyłem - wyjazd przodem)', false, false),
  // prettier-ignore
  createData('Parkowanie równoległe (wjazd tyłem - wyjazd przodem)', false, false),
  // prettier-ignore
  createData('Ruszanie z miejsca do przodu na wzniesieniu', false, false),
];

export const TraineeReport = () => {
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
          <MUILink
            underline="hover"
            to={`/kursanci/${traineeId}`}
            component={Link}
            variant="h6"
          >
            {trainee.user.firstName} {trainee.user.lastName}
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            Raport
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Report rows={REPORTS_ROWS} />
    </div>
  );
};
