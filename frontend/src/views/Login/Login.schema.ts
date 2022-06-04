import * as Yup from 'yup';
import { setupYupLocale } from '../../utils/setupYupLocale';

export interface LoginForm {
  email: string;
  password: string;
}

setupYupLocale();
export const LoginFormSchema: Yup.SchemaOf<LoginForm> = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});
