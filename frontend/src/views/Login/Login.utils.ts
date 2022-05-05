import * as Yup from 'yup';

export const LoginFormSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});
