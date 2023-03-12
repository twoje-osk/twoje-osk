import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface MyProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  oldPassword: string | undefined;
  newPassword: string | undefined;
}

setupYupLocale();
export const myProfileFormSchema: Yup.SchemaOf<MyProfileFormData> =
  Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().required().email(),
    phoneNumber: Yup.string()
      .min(9)
      .max(12)
      .matches(/\+{1}[0-9]{11}|[0-9]{9}/)
      .required(),
    oldPassword: Yup.string().when(
      'newPassword',
      (newPassword, schema: Yup.StringSchema) => {
        if (newPassword) {
          return schema.required(
            'Aby zmienić hasło musisz podać swoje poprzednie hasło.',
          );
        }

        return schema;
      },
    ),
    newPassword: Yup.string().min(8).max(64),
  });
