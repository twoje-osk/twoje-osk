import { Grid, InputAdornment, Stack } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { ReactNode } from 'react';
import { Flex } from 'reflexbox';
import { FTextField } from '../../../components/FTextField/FTextField';
import { PaymentFormData, paymentFormSchema } from './PaymentForm.schema';

interface PaymentFormProps {
  initialValues?: PaymentFormData;
  disabled?: boolean;
  onSubmit?: (
    values: PaymentFormData,
    formikHelpers: FormikHelpers<PaymentFormData>,
  ) => void | Promise<any>;
  children?: ReactNode;
}

const defaultValues: PaymentFormData = {
  amount: 0,
  date: new Date(),
  note: '',
};

export const PaymentForm = ({
  initialValues,
  disabled,
  onSubmit = () => undefined,
  children: actions,
}: PaymentFormProps) => {
  return (
    <Formik<PaymentFormData>
      initialValues={initialValues ?? defaultValues}
      validationSchema={paymentFormSchema}
      onSubmit={onSubmit as any}
      enableReinitialize
    >
      <Form noValidate>
        <Flex style={{ gap: '32px' }} alignItems="flex-start">
          <Stack spacing={2} style={{ flex: 1 }} justifyContent="flex-start">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FTextField
                  required
                  id="amount"
                  name="amount"
                  label="Kwota"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">PLN</InputAdornment>
                    ),
                  }}
                  disabled={disabled}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <FTextField
                  required
                  id="date"
                  name="date"
                  label="Data"
                  type="date"
                  disabled={disabled}
                  fullWidth
                />
              </Grid>
            </Grid>

            <FTextField
              required
              id="note"
              name="note"
              label="Uwagi"
              disabled={disabled}
              multiline
              rows={4}
            />
            {actions && <div>{actions}</div>}
          </Stack>
        </Flex>
      </Form>
    </Formik>
  );
};
