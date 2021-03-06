import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface TraineeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pesel: string;
  pkk: string;
  driversLicenseNumber?: string;
  createdAt: Date;
}

setupYupLocale();
export const traineeFormSchema: Yup.SchemaOf<TraineeFormData> =
  Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().required().email(),
    phoneNumber: Yup.string().required(),
    pesel: Yup.string().required(),
    pkk: Yup.string().required(),
    driversLicenseNumber: Yup.string()
      .optional()
      .transform((value) => (value === '' ? undefined : value)),
    createdAt: Yup.date().required(),
  });
