import * as Yup from 'yup';
import { setupYupLocale } from '../../utils/setupYupLocale';

export interface SignUpForm {
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  pkk: string;
}

setupYupLocale();
export const SignUpFormSchema: Yup.SchemaOf<SignUpForm> = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(64).required(),
  phoneNumber: Yup.string().required(),
  dateOfBirth: Yup.date().required(),
  pkk: Yup.string().required(),
});
