import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface InstructorsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  registrationNumber: string;
  photo?: string | null;
  instructorsQualifications: number[];
}

setupYupLocale();
export const instructorsFormSchema: Yup.SchemaOf<InstructorsFormData> =
  Yup.object().shape({
    photo: Yup.string(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().required().email(),
    phoneNumber: Yup.string()
      .min(9)
      .max(12)
      .matches(/\+{1}[0-9]{11}|[0-9]{9}/)
      .required(),
    licenseNumber: Yup.string()
      .length(10)
      .matches(/[\d\w]{6}/)
      .required(),
    registrationNumber: Yup.string().length(6).matches(/\d{6}/).required(),
    instructorsQualifications: Yup.array().of(Yup.number().required()),
  });
