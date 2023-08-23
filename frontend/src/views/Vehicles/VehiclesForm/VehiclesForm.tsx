import styled from '@emotion/styled';
import { Paper, Stack } from '@mui/material';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';
import { ReactNode } from 'react';
import { Flex } from 'reflexbox';
import { FTextField } from '../../../components/FTextField/FTextField';
import { theme } from '../../../theme';
import {
  vehicleFormSchema,
  VehiclesFormData,
  VehiclesSubmitData,
} from './VehiclesForm.schema';

interface VehiclesFormProps {
  initialValues?: VehiclesFormData;
  disabled?: boolean;
  onSubmit?: (
    values: VehiclesSubmitData,
    formikHelpers: FormikHelpers<VehiclesSubmitData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

const defaultValues: VehiclesFormData = {
  name: '',
  licensePlate: '',
  vin: '',
  dateOfNextCheck: null,
  additionalDetails: '',
  notes: '',
  photo: '',
};

export const VehiclesForm = ({
  initialValues,
  disabled,
  onSubmit = () => undefined,
  children: actions,
}: VehiclesFormProps) => {
  return (
    <Formik<VehiclesFormData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={vehicleFormSchema}
      onSubmit={onSubmit as any}
      enableReinitialize
    >
      <Form noValidate>
        <Flex style={{ gap: '32px' }} alignItems="flex-start">
          <Photo />
          <Debug />
          <Stack spacing={2} style={{ flex: 1 }} justifyContent="flex-start">
            <FTextField
              required
              id="name"
              name="name"
              label="Nazwa"
              disabled={disabled}
            />
            <FTextField
              required
              id="licensePlate"
              name="licensePlate"
              label="Numer Rejestracyjny"
              disabled={disabled}
            />
            <FTextField
              required
              id="vin"
              name="vin"
              label="Numer VIN"
              disabled={disabled}
            />
            <FTextField
              required
              id="dateOfNextCheck"
              name="dateOfNextCheck"
              label="Data Następnego Przeglądu"
              type="date"
              disabled={disabled}
            />
            <FTextField
              id="additionalDetails"
              name="additionalDetails"
              label="Dodatkowe Informacje"
              multiline
              rows={4}
              disabled={disabled}
            />
            <FTextField
              id="notes"
              name="notes"
              label="Notatki"
              multiline
              rows={4}
              disabled={disabled}
            />
            {actions && <div>{actions}</div>}
          </Stack>
        </Flex>
      </Form>
    </Formik>
  );
};

const Debug = () => {
  const form = useFormikContext();
  console.log(form);

  return null;
};

const Photo = () => {
  const [{ value: photo }] = useField<VehiclesFormData['photo']>({
    name: 'photo',
  });

  return (
    <StyledImageWrapper elevation={1}>
      {photo && <StyledImage width={320} as="img" src={photo} alt="" />}
      {!photo && 'Brak Zdjęcia'}
    </StyledImageWrapper>
  );
};

const StyledImageWrapper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 320px;
  height: 240px;

  background: ${theme.palette.grey[300]};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
