import { Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import {
  PaymentFormNewData,
  PaymentForNewInitialData,
  paymentFormNewSchema,
} from './PaymentFormNew.schema';
import { PaymentFormFields } from './PaymentFormFields';
import { TraineesAutocomplete } from '../../../components/TraineesAutocomplete/TraineesAutocomplete';

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
  return (
    <Formik<PaymentForNewInitialData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={paymentFormNewSchema}
      onSubmit={onSubmit as any}
      enableReinitialize
    >
      <PaymentFormFields actions={actions} disabled={disabled}>
        <TraineesAutocomplete
          label="Kursant"
          name="traineeId"
          id="traineeId"
          required
        />
      </PaymentFormFields>
    </Formik>
  );
};
