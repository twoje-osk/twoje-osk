import { LoadingButton } from '@mui/lab';
import {
  Breadcrumbs,
  Button,
  Icon,
  Link as MUILink,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  InstructorCreateRequestDto,
  InstructorCreateResponseDto,
} from '@osk/shared';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { useMakeRequestWithAuth } from '../../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { theme } from '../../../theme';
import { InstructorsForm } from '../InstructorsForm/InstructorsForm';
import { InstructorsFormData } from '../InstructorsForm/InstructorsForm.schema';

export const InstructorsNew = () => {
  const makeRequest = useMakeRequestWithAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (instructorValues: InstructorsFormData) => {
    const {
      photo,
      registrationNumber,
      licenseNumber,
      instructorsQualifications,
      ...userValues
    } = instructorValues;
    const body: InstructorCreateRequestDto = {
      instructor: {
        registrationNumber,
        licenseNumber,
        instructorsQualifications,
        user: { ...userValues, password: '', isActive: false },
        photo: photo ?? null,
      },
    };

    setIsLoading(true);
    const instructorApiUrl = `/api/instructors`;
    const response = await makeRequest<
      InstructorCreateResponseDto,
      InstructorCreateRequestDto
    >(instructorApiUrl, 'POST', body);

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    navigate(`/instruktorzy/${response.data.id}`);
    showSuccessSnackbar(
      `Instruktor ${userValues.firstName} ${userValues.lastName} został utworzony`,
    );
  };

  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

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
            Nowy Instruktor
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <InstructorsForm onSubmit={handleSubmit}>
          <Stack direction="row" spacing={1}>
            <LoadingButton
              variant="contained"
              startIcon={<Icon>save</Icon>}
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Zapisz
            </LoadingButton>
            <Button
              variant="outlined"
              component={Link}
              to="/instruktorzy"
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </Stack>
        </InstructorsForm>
      </Box>
    </div>
  );
};
