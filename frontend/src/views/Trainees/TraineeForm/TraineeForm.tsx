import { MenuItem, Stack } from '@mui/material';
import { DriversLicenseCategoryFindAllResponseDto } from '@osk/shared';
import { Form, Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import { PicklistOption } from '../../../components/FPicklistField/FPicklistField';
import { FTextField } from '../../../components/FTextField/FTextField';
import { FSelect } from '../../../components/FSelect/FSelect';
import { traineeFormSchema, TraineeFormData } from './TraineeForm.schema';

interface TraineeFormProps {
  initialValues?: TraineeFormData;
  disabled?: boolean;
  onSubmit?: (
    values: TraineeFormData,
    formikHelpers: FormikHelpers<TraineeFormData>,
  ) => void | Promise<any>;
  children?: ReactNode;
  hideCreatedAt?: boolean;
  isCreate?: boolean;
}

const defaultValues: Omit<TraineeFormData, 'driversLicenseCategory'> & {
  driversLicenseCategory: TraineeFormData['driversLicenseCategory'] | undefined;
} = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  pesel: '',
  dateOfBirth: undefined,
  pkk: '',
  driversLicenseNumber: '',
  createdAt: new Date(),
  driversLicenseCategory: undefined,
};

export const TraineeForm = ({
  initialValues,
  disabled,
  onSubmit = () => undefined,
  children: actions,
  hideCreatedAt = false,
  isCreate = false,
}: TraineeFormProps) => {
  const { data: driversLicenseCategoryData } =
    useSWR<DriversLicenseCategoryFindAllResponseDto>(
      '/api/drivers-license-categories',
    );
  const driversLicenseCategoryOptions: PicklistOption[] =
    driversLicenseCategoryData?.categories
      ? driversLicenseCategoryData.categories.map((el) => {
          return { value: el.id, label: el.name };
        })
      : [];

  return (
    <Formik<TraineeFormData>
      initialValues={initialValues ?? (defaultValues as TraineeFormData)}
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
              id="dateOfBirth"
              name="dateOfBirth"
              label="Data Urodzenia"
              type="date"
              disabled={disabled}
            />
            <FTextField
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
            <FSelect
              id="driversLicenseCategory"
              label="Kategoria Prawa Jazdy"
              name="driversLicenseCategory"
              disabled={disabled || !isCreate}
              required
            >
              {driversLicenseCategoryOptions.map((category) => (
                <MenuItem value={category.value} key={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </FSelect>
            {!hideCreatedAt && (
              <FTextField
                id="createdAt"
                name="createdAt"
                label="Data Dołączenia"
                type="date"
                disabled
              />
            )}
            {actions && <div>{actions}</div>}
          </Stack>
        </Flex>
      </Form>
    </Formik>
  );
};
