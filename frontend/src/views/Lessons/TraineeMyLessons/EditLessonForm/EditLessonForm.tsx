import {
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { InstructorFindAllResponseDto } from '@osk/shared';
import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { Form, Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import useSWR from 'swr';
import { FSelect } from '../../../../components/FSelect/FSelect';
import { FTextField } from '../../../../components/FTextField/FTextField';
import { getTranslatedLessonStatus } from '../TraineeMyLessons.utils';
import {
  LessonFormData,
  lessonFormSchema,
  LessonSubmitData,
} from './EditLessonForm.schema';
import { combineDateWithTime } from './EditLessonForm.utils';

interface EditLessonFormProps {
  initialValues?: LessonFormData;
  onSubmit: (
    values: LessonSubmitData,
    formikHelpers: FormikHelpers<LessonFormData>,
  ) => void | Promise<any>;
  children: ReactNode;
  showStatus?: boolean;
  disabled?: boolean;
}

const defaultValues: LessonFormData = {
  date: new Date(),
  startTime: new Date(),
  endTime: new Date(),
  status: LessonStatus.Requested,
  instructorId: null,
};

export const EditLessonForm = ({
  initialValues,
  onSubmit,
  children: actions,
  disabled = false,
  showStatus = false,
}: EditLessonFormProps) => {
  const { data: instructorsData } =
    useSWR<InstructorFindAllResponseDto>('/api/instructors');

  return (
    <Formik<LessonFormData>
      validationSchema={lessonFormSchema}
      onSubmit={(
        values: LessonFormData,
        formikHelpers: FormikHelpers<LessonFormData>,
      ) => {
        const submitData: LessonSubmitData = {
          start: combineDateWithTime(values.date, values.startTime),
          end: combineDateWithTime(values.date, values.endTime),
          status: values.status,
          instructorId: values.instructorId,
        };

        return onSubmit(submitData, formikHelpers);
      }}
      initialValues={initialValues ?? defaultValues}
      enableReinitialize
    >
      {({ values }) => {
        const selectedInstructor = instructorsData?.instructors.find(
          ({ id }) => id === values.instructorId,
        );

        return (
          <Stack spacing={2} width="100%" component={Form} noValidate>
            <FTextField
              name="date"
              type="date"
              fullWidth
              label="Data lekcji"
              disabled={disabled}
            />
            <FTextField
              name="startTime"
              type="time"
              fullWidth
              label="Godzina rozpoczęcia"
              disabled={disabled}
            />
            <FTextField
              name="endTime"
              type="time"
              fullWidth
              label="Godzina zakończenia"
              disabled={disabled}
            />
            {showStatus && (
              <FSelect id="status-picker" label="Status" name="status" disabled>
                {Object.values(LessonStatus).map((status) => (
                  <MenuItem value={status} key={status}>
                    {getTranslatedLessonStatus(status)}
                  </MenuItem>
                ))}
              </FSelect>
            )}
            {selectedInstructor && (
              <FormControl>
                <InputLabel id="instructorId-label">Instruktor</InputLabel>
                <Select
                  name="instructorId"
                  fullWidth
                  label="Instruktor"
                  labelId="instructorId-label"
                  value={selectedInstructor.id}
                  disabled
                >
                  {selectedInstructor ? (
                    <MenuItem value={selectedInstructor.id}>
                      {selectedInstructor.user.firstName}{' '}
                      {selectedInstructor.user.lastName}
                    </MenuItem>
                  ) : null}
                </Select>
              </FormControl>
            )}
            {actions && <div>{actions}</div>}
          </Stack>
        );
      }}
    </Formik>
  );
};
