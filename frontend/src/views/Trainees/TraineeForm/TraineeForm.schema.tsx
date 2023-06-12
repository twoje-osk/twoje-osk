import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';
import { validatePesel } from './TraineeForm.utils';

export interface TraineeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  pesel?: string;
  pkk: string;
  driversLicenseNumber: string | undefined;
  driversLicenseCategory: number;
  createdAt: Date;
}

setupYupLocale();
export const traineeFormSchema: Yup.SchemaOf<TraineeFormData> =
  Yup.object().shape({
    firstName: Yup.string().required().max(64),
    lastName: Yup.string().required().max(64),
    email: Yup.string().required().email(),
    phoneNumber: Yup.string()
      .min(9)
      .max(12)
      .matches(
        /[0-9]{11}|[0-9]{9}/,
        'Niepoprawny numer telefonu (Format: 000000000)',
      )
      .required(),
    dateOfBirth: Yup.date().required(),
    pesel: Yup.string()
      .optional()
      .transform((value) => (value === '' ? undefined : value))
      .length(11)
      .matches(/\d{11}/, 'Niepoprawny numer PESEL')
      .test('is-pesel', 'Niepoprawny numer PESEL', validatePesel),
    pkk: Yup.string()
      .required()
      .length(20)
      .matches(/\d{20}/, 'Niepoprawny numer PKK'),
    driversLicenseNumber: Yup.string()
      .optional()
      .transform((value) => (value === '' ? undefined : value))
      .max(32),
    driversLicenseCategory: Yup.number().required(),
    createdAt: Yup.date().required(),
  });
