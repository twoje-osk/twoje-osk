import {
  Breadcrumbs,
  Icon,
  Link as MUILink,
  Toolbar,
  Typography,
} from '@mui/material';
import { LectureFindOneResponseDto } from '@osk/shared';
import { Navigate, useParams, Link } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { theme } from '../../../theme';

export const LectureDetails = () => {
  const { lectureId } = useParams();
  const { data, error } = useSWR<LectureFindOneResponseDto>(
    lectureId ? `/api/lectures/${lectureId}` : null,
  );

  if (lectureId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const { lecture } = data;

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
            to="/wyklady"
            component={Link}
            variant="h6"
          >
            Wykłady
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {lecture.subject}
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box
        as="main"
        p="16px"
        pt="0"
        dangerouslySetInnerHTML={{ __html: lecture.body }}
      />
    </div>
  );
};
