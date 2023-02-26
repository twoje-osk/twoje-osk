import { Stack } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import { Flex } from 'reflexbox';
import { FPasswordTextField } from '../../../components/FPasswordTextField/FPasswordTextField';
import { FTextField } from '../../../components/FTextField/FTextField';
import { MyProfileFormData, myProfileFormSchema } from './MyProfileForm.schema';

interface MyProfileFormProps {
  initialValues: MyProfileFormData;
  disabledFields: readonly (keyof MyProfileFormData)[];
  onSubmit?: (
    values: MyProfileFormData,
    formikHelpers: FormikHelpers<MyProfileFormData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

export const MyProfileForm = ({
  initialValues,
  disabledFields,
  onSubmit = () => undefined,
  children: actions,
}: MyProfileFormProps) => {
  return (
    <Formik<MyProfileFormData>
      initialValues={initialValues}
      validationSchema={myProfileFormSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form noValidate>
        <Flex style={{ gap: '32px' }} alignItems="flex-start">
          <Stack spacing={2} style={{ flex: 1 }} justifyContent="flex-start">
            <FTextField
              required
              id="firstName"
              name="firstName"
              label="Imię"
              disabled={disabledFields.includes('firstName')}
            />
            <FTextField
              required
              id="lastName"
              name="lastName"
              label="Nazwisko"
              disabled={disabledFields.includes('lastName')}
            />
            <FTextField
              required
              id="email"
              name="email"
              label="Email"
              disabled={disabledFields.includes('email')}
            />
            <FTextField
              required
              id="phoneNumber"
              name="phoneNumber"
              label="Numer telefonu"
              type="phoneNumber"
              disabled={disabledFields.includes('phoneNumber')}
            />
            <FPasswordTextField
              id="oldPassword"
              name="oldPassword"
              label="Stare hasło"
              autoComplete="password"
              disabled={disabledFields.includes('oldPassword')}
            />
            <FPasswordTextField
              id="newPassword"
              name="newPassword"
              label="Nowe hasło"
              autoComplete="new-password"
              disabled={disabledFields.includes('newPassword')}
            />
            {actions && <div>{actions}</div>}
          </Stack>
        </Flex>
      </Form>
    </Formik>
  );
};
