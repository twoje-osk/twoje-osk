import { Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import {
  PaymentFormData,
  PaymentFormInitialData,
  paymentFormSchema,
} from './PaymentForm.schema';
import { PaymentFormFields } from './PaymentFormFields';

interface PaymentFormProps {
  initialValues?: PaymentFormInitialData;
  disabled?: boolean;
  onSubmit?: (
    values: PaymentFormData,
    formikHelpers: FormikHelpers<PaymentFormData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

const defaultValues: PaymentFormInitialData = {
  amount: undefined,
  date: new Date(),
  note: '',
};

export const PaymentForm = ({
  initialValues,
  disabled = false,
  onSubmit = () => undefined,
  children: actions,
}: PaymentFormProps) => {
  return (
    <Formik<PaymentFormInitialData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={paymentFormSchema}
      onSubmit={onSubmit as any}
      enableReinitialize
    >
      <PaymentFormFields actions={actions} disabled={disabled} />
    </Formik>
  );
};
