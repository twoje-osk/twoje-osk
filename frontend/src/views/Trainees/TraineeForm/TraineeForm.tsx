import { Stack } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import { Flex } from 'reflexbox';
import { FTextField } from '../../../components/FTextField/FTextField';
import { traineeFormSchema, TraineeFormData } from './TraineeForm.schema';

interface TraineeFormProps {
  initialValues?: TraineeFormData;
  disabled?: boolean;
  onSubmit?: (
    values: TraineeFormData,
    formikHelpers: FormikHelpers<TraineeFormData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

const defaultValues: TraineeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  pesel: '',
  pkk: '',
  driversLicenseNumber: '',
  createdAt: new Date(),
};

export const TraineeForm = ({
  initialValues,
  disabled,
  onSubmit = () => undefined,
  children: actions,
}: TraineeFormProps) => {
  return (
    <Formik<TraineeFormData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={traineeFormSchema}
      onSubmit={onSubmit as any}
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
              disabled={disabled}
            />
            <FTextField
              required
              id="lastName"
              name="lastName"
              label="Nazwisko"
              disabled={disabled}
            />
            <FTextField
              required
              id="email"
              name="email"
              label="Email"
              disabled={disabled}
            />
            <FTextField
              required
              id="phoneNumber"
              name="phoneNumber"
              label="Numer Telefonu"
              disabled={disabled}
            />
            <FTextField
              required
              id="pesel"
              name="pesel"
              label="PESEL"
              disabled={disabled}
            />
            <FTextField
              id="driversLicenseNumber"
              name="driversLicenseNumber"
              label="Numer Prawa Jazdy"
              disabled={disabled}
            />
            <FTextField
              required
              id="pkk"
              name="pkk"
              label="Numer PKK"
              disabled={disabled}
            />
            <FTextField
              id="createdAt"
              name="createdAt"
              label="Data Dołączenia"
              type="date"
              disabled
            />
            {actions && <div>{actions}</div>}
          </Stack>
        </Flex>
      </Form>
    </Formik>
  );
};
