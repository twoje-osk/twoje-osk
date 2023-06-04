import Toolbar from '@mui/material/Toolbar';
import MUILink from '@mui/material/Link';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Breadcrumbs,
  FormControl,
  FormHelperText,
  Icon,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import useSWR from 'swr';
import { GetLessonByIdResponseDTO } from '@osk/shared';
import { Box, Flex } from 'reflexbox';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { LoadingButton } from '@mui/lab';
import { useMemo } from 'react';
import { theme } from '../../../../theme';
import { FullPageLoading } from '../../../../components/FullPageLoading/FullPageLoading';
import { GeneralAPIError } from '../../../../components/GeneralAPIError/GeneralAPIError';
import { formatTime, formatVeryLongDate } from '../../../../utils/date';
import {
  useFinishLessonApiRequest,
  useSelectedVehicle,
} from './InstructorFinishLesson.hooks';
import { InstructorFinishLessonReport } from './InstructorFinishLessonReport/InstructorFinishLessonReport';
import { InstructorFinishLessonTraineeData } from './InstructorFinishLessonTraineeData/InstructorFinishLessonTraineeData';

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
    selectedVehicle: selectedVehicleId,
    hasSelectedVehicleSubmitError,
    setHasSelectedVehicleSubmitError,
    onVehicleChange,
  } = useSelectedVehicle(lessonData?.lesson.vehicleId ?? null);

  const lesson = lessonData?.lesson;
  const { isSubmitting, onSave, onRevertSave } = useFinishLessonApiRequest({
    lesson,
    mutateLesson,
    selectedVehicle: selectedVehicleId,
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

  if (
    lesson.status !== LessonStatus.Finished &&
    lesson.status !== LessonStatus.Accepted
  ) {
    return <Navigate to={`/moje-jazdy/${lessonId}`} />;
  }

  const traineeId = lesson.trainee.id;
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
          <FormControl fullWidth size="small">
            <InputLabel id="vehicle-label">Użyty Pojazd</InputLabel>
            <Select<number | string>
              labelId="vehicle-label"
              id="vehicle"
              value={selectedVehicleId ?? ''}
              label="Użyty Pojazd"
              onChange={onVehicleChange}
              disabled={lesson.status === LessonStatus.Finished || isSubmitting}
              error={hasSelectedVehicleSubmitError}
              placeholder="Wybierz Pojazd"
              renderValue={(value) => {
                const selectedVehicle = vehicles.find((v) => v.id === value);

                if (selectedVehicle === undefined) {
                  return null;
                }

                return selectedVehicle.name;
              }}
            >
              {vehicles.map((vehicle) => (
                <MenuItem value={vehicle.id} key={vehicle.id}>
                  {vehicle.isFavourite && (
                    <ListItemIcon>
                      <Icon>star</Icon>
                    </ListItemIcon>
                  )}

                  {`${vehicle.name} (${vehicle.licensePlate})`}
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
          loading={isSubmitting}
        >
          {lesson.status === LessonStatus.Finished
            ? 'Cofnij Zakończenie Jazdy'
            : 'Zakończ Jazdę'}
        </LoadingButton>
      </Stack>
      <InstructorFinishLessonTraineeData trainee={lesson.trainee} />
      <InstructorFinishLessonReport traineeId={traineeId} />
    </Flex>
  );
};
