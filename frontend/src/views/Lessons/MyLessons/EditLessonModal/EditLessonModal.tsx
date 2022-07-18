import { LoadingButton } from '@mui/lab';
import {
  Modal,
  Paper,
  Typography,
  Stack,
  Button,
  Icon,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { Form, Formik } from 'formik';
import { FTextField } from '../../../../components/FTextField/FTextField';
import { LessonEvent } from '../LessonsCalendar/LessonsCalendar.types';
import { getTranslatedLessonStatus } from '../MyLessons.utils';
import { LessonFormData, lessonFormSchema } from './EditLessonModal.schema';

interface EditLessonModalProps {
  event: LessonEvent | null;
  isOpen: boolean;
  onClose: () => void;
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
  onClose,
}: EditLessonModalProps) => {
  const editingEnabled =
    event?.status === LessonStatus.Requested ||
    event?.status === LessonStatus.Accepted;

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-modal-title">
      <Paper sx={style} elevation={24}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edytuj lekcję
        </Typography>
        <Stack direction="row" spacing={1}>
          <Formik<LessonFormData>
            validationSchema={lessonFormSchema}
            onSubmit={() => undefined}
            initialValues={mapEventToFormValues(event)}
            enableReinitialize
          >
            <Stack spacing={2} width="100%" marginTop={2} component={Form}>
              <FTextField
                name="date"
                type="date"
                fullWidth
                label="Data lekcji"
                disabled={!editingEnabled}
              />
              <FTextField
                name="startTime"
                type="time"
                fullWidth
                label="Godzina rozpoczęcia"
                disabled={!editingEnabled}
              />
              <FTextField
                name="endTime"
                type="time"
                fullWidth
                label="Godzina zakończenia"
                disabled={!editingEnabled}
              />
              {event && (
                <FormControl>
                  <InputLabel id="status-picker-label">Status</InputLabel>
                  <Select
                    labelId="status-picker-label"
                    id="status-picker"
                    label="Status"
                    value="status"
                    name="status"
                    disabled
                  >
                    <MenuItem value="status">
                      {getTranslatedLessonStatus(event)}
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Stack direction="row" spacing={1}>
                  <LoadingButton
                    variant="contained"
                    startIcon={<Icon>save</Icon>}
                    type="submit"
                    disabled={!editingEnabled}
                  >
                    Zapisz
                  </LoadingButton>
                  <Button variant="outlined" onClick={onClose}>
                    Anuluj
                  </Button>
                </Stack>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Icon>delete</Icon>}
                  disabled={!editingEnabled}
                >
                  Anuluj lekcję
                </Button>
              </Stack>
            </Stack>
          </Formik>
        </Stack>
      </Paper>
    </Modal>
  );
};

function mapEventToFormValues(event: LessonEvent | null): LessonFormData {
  if (event === null) {
    return {
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      status: LessonStatus.Requested,
    };
  }

  return {
    date: event.start,
    startTime: event.start,
    endTime: event.end,
    status: event.status,
  };
}
