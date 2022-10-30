import styled from '@emotion/styled';
import { Paper, Stack } from '@mui/material';
import { DriversLicenseCategoryFindAllResponseDto } from '@osk/shared';
import { Form, Formik, FormikHelpers, useField } from 'formik';
import { ReactNode } from 'react';
import { Flex } from 'reflexbox';
import useSWR from 'swr';
import {
  FPicklistField,
  PicklistOption,
} from '../../../components/FPicklistField/FPicklistField';
import { FTextField } from '../../../components/FTextField/FTextField';
import { theme } from '../../../theme';
import {
  InstructorsFormData,
  instructorsFormSchema,
} from './InstructorsForm.schema';

interface InstructorsFormProps {
  initialValues?: InstructorsFormData;
  disabled?: boolean;
  onSubmit?: (
    values: InstructorsFormData,
    formikHelpers: FormikHelpers<InstructorsFormData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

const defaultValues: InstructorsFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  licenseNumber: '',
  registrationNumber: '',
  instructorsQualificationsIds: [],
  photo: '',
};

export const InstructorsForm = ({
  initialValues,
  disabled,
  onSubmit = () => undefined,
  children: actions,
}: InstructorsFormProps) => {
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
    <Formik<InstructorsFormData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={instructorsFormSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      <Form noValidate>
        <Flex style={{ gap: '32px' }} alignItems="flex-start">
          <Photo />
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
              label="Numer telefonu"
              type="phoneNumber"
              disabled={disabled}
            />
            <FTextField
              required
              id="licenseNumber"
              name="licenseNumber"
              label="Numer legitymacji instruktorskiej"
              type="licenseNumber"
              disabled={disabled}
            />
            <FTextField
              required
              id="registrationNumber"
              name="registrationNumber"
              label="Numer ewidencyjny"
              type="registrationNumber"
              disabled={disabled}
            />
            <FPicklistField
              id="instructorsQualificationsIds"
              label="Uprawnienia"
              name="instructorsQualificationsIds"
              disabled={disabled}
              options={driversLicenseCategoryOptions}
              predefinedValues={
                initialValues?.instructorsQualificationsIds ?? []
              }
              multiple
            />
            {actions && <div>{actions}</div>}
          </Stack>
        </Flex>
      </Form>
    </Formik>
  );
};

const Photo = () => {
  const [{ value: photo }] = useField<InstructorsFormData['photo']>({
    name: 'photo',
  });

  return (
    <StyledImageWrapper elevation={1}>
      {photo && <StyledImage width={240} as="img" src={photo} alt="" />}
      {!photo && 'Brak Zdjęcia'}
    </StyledImageWrapper>
  );
};

const StyledImageWrapper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 240px;
  height: 320px;

  background: ${theme.palette.grey[300]};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
