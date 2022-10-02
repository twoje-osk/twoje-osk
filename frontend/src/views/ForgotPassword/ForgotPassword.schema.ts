import * as Yup from 'yup';
import { setupYupLocale } from '../../utils/setupYupLocale';

export interface ForgotPasswordForm {
  email: string;
}

setupYupLocale();
export const ForgotPasswordFormSchema: Yup.SchemaOf<ForgotPasswordForm> =
  Yup.object().shape({
    email: Yup.string().required(),
  });
