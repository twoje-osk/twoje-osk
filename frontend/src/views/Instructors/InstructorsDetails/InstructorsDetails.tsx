import {
  Breadcrumbs,
  Button,
  Icon,
  Link as MUILink,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { InstructorFindOneResponseDto } from '@osk/shared';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Box } from 'reflexbox';
import useSWR from 'swr';
import { FullPageLoading } from '../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../components/GeneralAPIError/GeneralAPIError';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { theme } from '../../../theme';
import { InstructorsForm } from '../InstructorsForm/InstructorsForm';
import { InstructorsFormData } from '../InstructorsForm/InstructorsForm.schema';

export const InstructorsDetails = () => {
  const { instructorId } = useParams();
  const { data, error } = useSWR<InstructorFindOneResponseDto>(
    instructorId ? `/api/instructors/${instructorId}` : null,
  );

  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();
  if (instructorId === undefined) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <GeneralAPIError />;
  }

  if (data === undefined) {
    return <FullPageLoading />;
  }

  const { instructor } = data;
  const initialValues: InstructorsFormData = {
    firstName: instructor.user.firstName,
    lastName: instructor.user.lastName,
    email: instructor.user.email,
    phoneNumber: instructor.user.phoneNumber,
  };

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
            to="/instruktorzy"
            component={Link}
            variant="h6"
          >
            Instruktorzy
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {instructor.user.firstName} {instructor.user.lastName}
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <InstructorsForm initialValues={initialValues} disabled>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<Icon>edit</Icon>}
              component={Link}
              to="edytuj"
            >
              Edytuj
            </Button>
            <Button
              color="error"
              variant="outlined"
              startIcon={<Icon>delete</Icon>}
            >
              Dezaktywuj
            </Button>
          </Stack>
        </InstructorsForm>
      </Box>
    </div>
  );
};
