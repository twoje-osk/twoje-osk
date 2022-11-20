import { LessonStatus } from '@osk/shared/src/types/lesson.types';
import { isAfter, isValid } from 'date-fns';
import * as Yup from 'yup';
import { setupYupLocale } from '../../../../utils/setupYupLocale';

export interface LessonFormData {
  date: Date;
  startTime: Date;
  endTime: Date;
  status: LessonStatus;
  instructorId: number | null;
  traineeId: number | null;
}

export interface LessonSubmitData {
  start: Date;
  end: Date;
  status: LessonStatus;
  instructorId: number | null;
  traineeId: number | null;
}

setupYupLocale();
export const lessonFormSchema: Yup.SchemaOf<LessonFormData> =
  Yup.object().shape({
    date: Yup.date().required(),
    startTime: Yup.date().required(),
    endTime: Yup.date()
      .required()
      .test(
        'isAfterStart',
        'Godzina zakończenia nie może być wcześniejsza od godziny rozpoczęcia',
        (endTime, options) => {
          // eslint-disable-next-line prefer-destructuring
          const parent: LessonFormData = options.parent;
          const { startTime } = parent;

          if (!isValid(startTime) || endTime === undefined) {
            return true;
          }

          return isAfter(endTime, startTime);
        },
      ),
    status: Yup.mixed<LessonStatus>()
      .oneOf(Object.values(LessonStatus))
      .required(),
    instructorId: Yup.number().required(),
    traineeId: Yup.number().required(),
  });
