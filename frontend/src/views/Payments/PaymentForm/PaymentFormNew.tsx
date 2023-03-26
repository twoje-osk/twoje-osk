import { MenuItem } from '@mui/material';
import { TraineeFindAllResponseDto } from '@osk/shared';
import { Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import useSWR from 'swr';
import { FSelect } from '../../../components/FSelect/FSelect';
import {
  PaymentFormNewData,
  PaymentForNewInitialData,
  paymentFormNewSchema,
} from './PaymentFormNew.schema';
import { PaymentFormFields } from './PaymentFormFields';

interface PaymentFormNewProps {
  initialValues?: PaymentForNewInitialData;
  disabled?: boolean;
  onSubmit?: (
    values: PaymentFormNewData,
    formikHelpers: FormikHelpers<PaymentFormNewData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

const defaultValues: PaymentForNewInitialData = {
  amount: undefined,
  traineeId: undefined,
  date: new Date(),
  note: '',
};

export const PaymentFormNew = ({
  initialValues,
  disabled = false,
  onSubmit = () => undefined,
  children: actions,
}: PaymentFormNewProps) => {
  const { data: traineesData } = useSWR<TraineeFindAllResponseDto>(
    () => '/api/trainees',
  );

  return (
    <Formik<PaymentForNewInitialData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={paymentFormNewSchema}
      onSubmit={onSubmit as any}
      enableReinitialize
    >
      <PaymentFormFields actions={actions} disabled={disabled}>
        <FSelect
          name="traineeId"
          id="traineeId"
          fullWidth
          label="Kursant"
          required
        >
          {traineesData?.trainees.map((trainee) => (
            <MenuItem value={trainee.id} key={trainee.id}>
              {trainee.user.firstName} {trainee.user.lastName}
            </MenuItem>
          ))}
        </FSelect>
      </PaymentFormFields>
    </Formik>
  );
};
