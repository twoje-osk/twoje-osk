import { LoadingButton } from '@mui/lab';
import {
  Modal,
  Paper,
  Typography,
  Stack,
  Button,
  Icon,
  Box,
  Breadcrumbs,
} from '@mui/material';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { UserRole } from '@osk/shared/src/types/user.types';
import MUILink from '@mui/material/Link';
import { FormikHelpers, useFormikContext } from 'formik';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TraineeFindAllResponseDto } from '@osk/shared';
import useSWR from 'swr';
import { useAuth } from '../../../../hooks/useAuth/useAuth';
import { theme } from '../../../../theme';
import { assertNever } from '../../../../utils/asserNever';
import { EditLessonForm } from '../EditLessonForm/EditLessonForm';
import {
  LessonFormData,
  LessonSubmitData,
} from '../EditLessonForm/EditLessonForm.schema';
import { combineDateWithTime } from '../EditLessonForm/EditLessonForm.utils';
import { LessonEvent } from '../LessonsCalendar/LessonsCalendar.types';

interface EditLessonModalProps {
  event: LessonEvent | null;
  isOpen: boolean;
  isCreating: boolean;
  isLoading: boolean;
  isCanceling: boolean;
  onClose: () => void;
  onSubmit: (
    values: LessonSubmitData,
    helpers: FormikHelpers<LessonFormData>,
  ) => void;
  onLessonCancel: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  p: 4,
  outline: 'none',
};

export const EditLessonModal = ({
  event,
  isOpen,
  isCreating,
  onClose,
  onSubmit,
  isLoading,
  isCanceling,
  onLessonCancel,
}: EditLessonModalProps) => {
  const { role } = useAuth();
  const editingEnabled =
    role === UserRole.Instructor ||
    event?.status === LessonStatus.Requested ||
    event?.status === LessonStatus.Accepted;
  const formikHelpers = useFormikContext<LessonFormData>();
  const navigate = useNavigate();

  const { data: traineesData } = useSWR<TraineeFindAllResponseDto>(
    () => '/api/trainees',
  );

  const modalStatusButtons = useMemo(() => {
    if (event === null) {
      return null;
    }

    const updateStatus = (status: LessonStatus) => {
      onSubmit(
        {
          ...event,
          status,
        },
        formikHelpers,
      );
    };

    const acceptButton = (
      <Button
        variant="contained"
        onClick={() => updateStatus(LessonStatus.Accepted)}
        color="success"
        startIcon={<Icon>done</Icon>}
      >
        Zaakceptuj Lekcję
      </Button>
    );

    const cancelButton = (
      <Button
        variant="contained"
        onClick={onLessonCancel}
        color="error"
        startIcon={<Icon>close</Icon>}
      >
        Anuluj Lekcję
      </Button>
    );

    const finishButton = (
      <Button
        variant="contained"
        onClick={() => navigate(`/moje-jazdy/${event.id}/zakoncz`)}
        color="success"
        startIcon={<Icon>done_all</Icon>}
      >
        Zakończ Lekcję
      </Button>
    );

    const finishedButton = (
      <Button
        variant="outlined"
        onClick={() => navigate(`/moje-jazdy/${event.id}/zakoncz`)}
        color="success"
        startIcon={<Icon>done_all</Icon>}
      >
        Zobacz Szczegóły Lekcji
      </Button>
    );

    if (event.status === LessonStatus.Requested) {
      return (
        <>
          {acceptButton}
          {cancelButton}
        </>
      );
    }

    if (event.status === LessonStatus.Canceled) {
      return acceptButton;
    }

    if (event.status === LessonStatus.Accepted) {
      return (
        <>
          {finishButton}
          {cancelButton}
        </>
      );
    }

    if (event.status === LessonStatus.Finished) {
      return finishedButton;
    }

    return assertNever(event.status);
  }, [event, formikHelpers, navigate, onLessonCancel, onSubmit]);

  const formValue = useMemo(() => mapEventToFormValues(event), [event]);
  const trainee = useMemo(() => {
    if (traineesData == null) {
      return null;
    }

    return traineesData.trainees.find(({ id }) => id === formValue?.traineeId);
  }, [formValue?.traineeId, traineesData]);

  return (
    <Modal
      open={isOpen}
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="edit-lesson-modal-title"
    >
      <Paper sx={style} elevation={24}>
        {isCreating && (
          <Typography id="edit-lesson-modal-title" variant="h6" component="h2">
            Dodaj nową lekcję
          </Typography>
        )}
        {!isCreating && (
          <Breadcrumbs separator={<Icon fontSize="small">navigate_next</Icon>}>
            <Typography
              variant="h6"
              color={theme.palette.text.primary}
              id="edit-lesson-modal-title"
            >
              Edytuj nową lekcję
            </Typography>
            <MUILink
              underline="hover"
              to={`/kursanci/${formValue?.traineeId}`}
              component={Link}
              variant="h6"
            >
              {trainee?.user.firstName} {trainee?.user.lastName}
            </MUILink>
          </Breadcrumbs>
        )}
        <Box marginTop={2}>
          <EditLessonForm
            onSubmit={onSubmit}
            initialValues={formValue}
            disabled={!editingEnabled || isLoading}
            showStatus={!isCreating && role !== UserRole.Instructor}
            isCreating={isCreating}
          >
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1}>
                <LoadingButton
                  variant={isCreating ? 'contained' : 'outlined'}
                  startIcon={<Icon>save</Icon>}
                  type="submit"
                  disabled={!editingEnabled || isCanceling}
                  loading={isLoading}
                >
                  Zapisz
                </LoadingButton>

                {(role === UserRole.Trainee || isCreating) && (
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={isLoading || isCanceling}
                  >
                    Anuluj
                  </Button>
                )}
              </Stack>
              {role === UserRole.Instructor && !isCreating && (
                <Stack direction="row" spacing={1}>
                  {modalStatusButtons}
                </Stack>
              )}
              {role === UserRole.Trainee && (
                <TraineeActionButtons
                  isCreating={isCreating}
                  editingEnabled={editingEnabled}
                  isLoading={isLoading}
                  isCanceling={isCanceling}
                  onLessonCancel={onLessonCancel}
                />
              )}
            </Stack>
          </EditLessonForm>
        </Box>
      </Paper>
    </Modal>
  );
};

function mapEventToFormValues(
  event: LessonEvent | null,
): LessonFormData | undefined {
  if (event === null) {
    return undefined;
  }

  return {
    date: event.start,
    startTime: combineDateWithTime(new Date(), event.start),
    endTime: combineDateWithTime(new Date(), event.end),
    status: event.status,
    instructorId: event.instructorId,
    traineeId: event.traineeId,
  };
}

interface TraineeActionButtonsProps {
  isCreating: boolean;
  editingEnabled: boolean;
  isLoading: boolean;
  isCanceling: boolean;
  onLessonCancel: () => void;
}
const TraineeActionButtons = ({
  isCreating,
  editingEnabled,
  isCanceling,
  isLoading,
  onLessonCancel,
}: TraineeActionButtonsProps) => {
  if (isCreating) {
    return null;
  }

  return (
    <LoadingButton
      variant="contained"
      startIcon={<Icon>delete</Icon>}
      disabled={!editingEnabled || isLoading || isCanceling}
      onClick={onLessonCancel}
      loading={isCanceling}
      color="error"
    >
      Anuluj lekcję
    </LoadingButton>
  );
};
