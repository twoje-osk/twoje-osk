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
  instructorsQualifications: string[];
}

setupYupLocale();
export const instructorsFormSchema: Yup.SchemaOf<InstructorsFormData> =
  Yup.object().shape({
    photo: Yup.string(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().required().email(),
    phoneNumber: Yup.string().required(),
    licenseNumber: Yup.string().required(),
    registrationNumber: Yup.string().required(),
    // eslint-disable-next-line react/forbid-prop-types
    instructorsQualifications: Yup.array(),
  });
