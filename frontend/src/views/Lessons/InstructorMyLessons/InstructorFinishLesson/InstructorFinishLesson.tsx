import Toolbar from '@mui/material/Toolbar';
import MUILink from '@mui/material/Link';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumbs,
  FormControl,
  FormHelperText,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import useSWR from 'swr';
import { GetLessonByIdResponseDTO } from '@osk/shared';
import { Box } from 'reflexbox';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { LoadingButton } from '@mui/lab';
import { useMemo } from 'react';
import { Report } from '../../../../components/Report/Report';
import { theme } from '../../../../theme';
import { FullPageLoading } from '../../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../../components/GeneralAPIError/GeneralAPIError';
import { formatTime, formatVeryLongDate } from '../../../../utils/date';
import { REPORTS_ROWS } from '../../../Trainees/TraineeReport/TraineeReport';
import {
  useFinishLessonApiRequest,
  useSelectedVehicle,
} from './InstructorFinishLesson.hooks';

export interface RowData {
  action: string;
  done: boolean;
  mastered: boolean;
}

export const InstructorFinishLesson = () => {
  const { lessonId } = useParams();
  const {
    data: lessonData,
    error: lessonError,
    mutate: mutateLesson,
  } = useSWR<GetLessonByIdResponseDTO>(`/api/instructor/lessons/${lessonId}`);

  const {
    vehicles,
    loadingState: vehiclesLoadingState,
    selectedVehicle,
    hasSelectedVehicleSubmitError,
    setHasSelectedVehicleSubmitError,
    onVehicleChange,
  } = useSelectedVehicle(lessonData?.lesson.vehicleId ?? null);

  const lesson = lessonData?.lesson;
  const { isSubmitting, onSave, onRevertSave } = useFinishLessonApiRequest({
    lesson,
    mutateLesson,
    selectedVehicle,
    setHasSelectedVehicleSubmitError,
  });

  const formattedDate = useMemo(() => {
    if (lesson === undefined) {
      return '';
    }

    const fromDate = new Date(lesson.from);
    const toDate = new Date(lesson.to);

    const datePart = formatVeryLongDate(fromDate);
    const timeFromPart = formatTime(fromDate);
    const timeToPart = formatTime(toDate);

    const timePart = `${timeFromPart}–${timeToPart}`;

    return `${datePart} (${timePart})`;
  }, [lesson]);

  if (vehiclesLoadingState === 'error' || lessonError) {
    return <GeneralAPIError />;
  }

  if (vehiclesLoadingState === 'loading' || lesson === undefined) {
    return <FullPageLoading />;
  }

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
            to="/moje-jazdy"
            component={Link}
            variant="h6"
          >
            Twoje Jazdy
          </MUILink>
          <MUILink
            underline="hover"
            to={`/moje-jazdy/${lessonId}`}
            component={Link}
            variant="h6"
          >
            {formattedDate}
          </MUILink>
          <Typography variant="h6" color={theme.palette.text.primary}>
            Zakończ Jazdę
          </Typography>
        </Breadcrumbs>
      </Toolbar>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: { sm: 2 },
          pb: { sm: 2 },
          justifyContent: 'space-between',
        }}
      >
        <Box width={300}>
          <FormControl fullWidth>
            <InputLabel id="vehicle-label">Użyty Pojazd</InputLabel>
            <Select<number | string>
              labelId="vehicle-label"
              id="vehicle"
              value={selectedVehicle ?? ''}
              label="Użyty Pojazd"
              onChange={onVehicleChange}
              disabled={lesson.status === LessonStatus.Finished || isSubmitting}
              error={hasSelectedVehicleSubmitError}
              placeholder="Wybierz Pojazd"
            >
              {vehicles.map((vehicle) => (
                <MenuItem value={vehicle.id} key={vehicle.id}>
                  {vehicle.name}
                </MenuItem>
              ))}
            </Select>
            {hasSelectedVehicleSubmitError && (
              <FormHelperText error>To pole jest wymagane</FormHelperText>
            )}
          </FormControl>
        </Box>
        <LoadingButton
          variant={
            lesson.status === LessonStatus.Finished ? 'outlined' : 'contained'
          }
          onClick={
            lesson.status === LessonStatus.Finished ? onRevertSave : onSave
          }
          color="success"
          startIcon={
            <Icon>
              {lesson.status === LessonStatus.Finished ? 'undo' : 'done_all'}
            </Icon>
          }
          disabled={isSubmitting}
          // disabled={lesson.status === LessonStatus.Finished || isSubmitting}
          loading={isSubmitting}
        >
          {lesson.status === LessonStatus.Finished
            ? 'Cofnij Zakończenie Jazdy'
            : 'Zakończ Jazdę'}
        </LoadingButton>
      </Stack>
      <Report rows={REPORTS_ROWS} />
    </div>
  );
};
