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
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from 'reflexbox';
import { useCommonSnackbars } from '../../../hooks/useCommonSnackbars/useCommonSnackbars';
import { theme } from '../../../theme';
import { TraineeForm } from '../TraineeForm/TraineeForm';
import { TraineeFormData } from '../TraineeForm/TraineeForm.schema';

export const TraineeNew = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useCommonSnackbars();

  const onSubmit = async (newTrainee: TraineeFormData) => {
    setIsLoading(true);

    // eslint-disable-next-line no-console
    console.log(newTrainee);
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((r) => setTimeout(r, 1000));

    const response = { ok: true, data: undefined as any };

    if (!response.ok) {
      setIsLoading(false);
      showErrorSnackbar();
      return;
    }

    const traineeId = 1;

    navigate(`/kursanci/${traineeId}`);
    // TODO: Remove '?'
    const fullName = `${response.data?.trainee.user.firstName} ${response.data?.trainee.user.lastName}`;
    showSuccessSnackbar(`Kursant ${fullName} został zmodyfikowany`);
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
            to="/kursanci"
            component={Link}
            variant="h6"
          >
            Kursanci
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            Nowy
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Box as="main" p="16px" pt="0">
        <TraineeForm onSubmit={onSubmit} hideCreatedAt>
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
              to="/pojazdy"
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </Stack>
        </TraineeForm>
      </Box>
    </div>
  );
};
