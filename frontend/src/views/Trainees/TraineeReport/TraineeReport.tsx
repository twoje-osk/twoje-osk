import Toolbar from '@mui/material/Toolbar';
import MUILink from '@mui/material/Link';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Icon, Typography } from '@mui/material';
import useSWR from 'swr';
import { TraineeFindOneResponseDto } from '@osk/shared';
import { Flex } from 'reflexbox';
import { theme } from '../../../theme';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { Report } from '../../../components/Report/Report';
import { useCourseReportData } from '../../../hooks/useCourseReportData/useCourseReportData';

export const TraineeReport = () => {
  const { traineeId } = useParams();
  const { data: traineeData, error: traineeError } =
    useSWR<TraineeFindOneResponseDto>(
      traineeId ? `/api/trainees/${traineeId}` : null,
    );

  const [courseReportData, updateRow] = useCourseReportData(
    traineeId ? Number.parseInt(traineeId, 10) : null,
  );

  if (traineeId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (traineeError || courseReportData.type === 'error') {
    return <GeneralAPIError />;
  }

  if (traineeData === undefined || courseReportData.type === 'loading') {
    return <FullPageLoading />;
  }

  const { trainee } = traineeData;

  return (
    <Flex height="100%" flexDirection="column">
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
      <Report groups={courseReportData.groups} onChange={updateRow} />
    </Flex>
  );
};
