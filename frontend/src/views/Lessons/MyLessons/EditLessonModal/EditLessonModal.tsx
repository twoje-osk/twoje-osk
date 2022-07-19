import { LoadingButton } from '@mui/lab';
import {
  Modal,
  Paper,
  Typography,
  Stack,
  Button,
  Icon,
  Box,
} from '@mui/material';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
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
  onClose: () => void;
  onSubmit: (values: LessonSubmitData) => void;
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
}: EditLessonModalProps) => {
  const editingEnabled =
    event?.status === LessonStatus.Requested ||
    event?.status === LessonStatus.Accepted;

  return (
    <Modal
      open={isOpen}
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="edit-lesson-modal-title"
    >
      <Paper sx={style} elevation={24}>
        <Typography id="edit-lesson-modal-title" variant="h6" component="h2">
          {isCreating ? 'Dodaj nową lekcję' : 'Edytuj lekcję'}
        </Typography>
        <Box marginTop={2}>
          <EditLessonForm
            onSubmit={onSubmit}
            initialValues={mapEventToFormValues(event)}
            disabled={!editingEnabled || isLoading}
            showStatus={!isCreating}
          >
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1}>
                <LoadingButton
                  variant="contained"
                  startIcon={<Icon>save</Icon>}
                  type="submit"
                  disabled={!editingEnabled}
                  loading={isLoading}
                >
                  Zapisz
                </LoadingButton>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Anuluj
                </Button>
              </Stack>
              {!isCreating && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Icon>delete</Icon>}
                  disabled={!editingEnabled || isLoading}
                >
                  Anuluj lekcję
                </Button>
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
  };
}
