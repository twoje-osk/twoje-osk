import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface InstructorsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photo?: string | null;
}

setupYupLocale();
export const instructorsFormSchema: Yup.SchemaOf<InstructorsFormData> =
  Yup.object().shape({
    photo: Yup.string(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().required().email(),
    phoneNumber: Yup.string().required(),
  });
