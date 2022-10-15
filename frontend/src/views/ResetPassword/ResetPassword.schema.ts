import * as Yup from 'yup';
import { setupYupLocale } from '../../utils/setupYupLocale';

export interface ResetPasswordForm {
  password: string;
}

setupYupLocale();
export const ResetPasswordFormSchema: Yup.SchemaOf<ResetPasswordForm> =
  Yup.object().shape({
    password: Yup.string()
      .min(8, 'Hasło musi mieć minimum 8 znaków')
      .max(64, 'Hasło może mieć maksimum 64 znaki')
      .required(),
  });
