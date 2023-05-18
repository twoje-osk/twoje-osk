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
  instructorsQualificationsIds: number[];
}

setupYupLocale();
export const instructorsFormSchema: Yup.SchemaOf<InstructorsFormData> =
  Yup.object().shape({
    photo: Yup.string(),
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
    licenseNumber: Yup.string()
      .length(10)
      .matches(/[\d\w]{6}/, 'To pole może zawierać tylko znaki')
      .required(),
    registrationNumber: Yup.string()
      .length(6)
      .matches(/\d{6}/, 'To pole może zawierać tylko znaki')
      .required(),
    instructorsQualificationsIds: Yup.array().of(Yup.number().required()),
  });
