import { Grid, InputAdornment, Stack } from '@mui/material';
import { Form } from 'formik';
import { ReactNode } from 'react';
import { Flex } from 'reflexbox';
import { FTextField } from '../../../components/FTextField/FTextField';

interface PaymentFormFieldsProps {
  disabled: boolean;
  children?: ReactNode;
  actions: ReactNode;
}
export const PaymentFormFields = ({
  actions,
  children,
  disabled,
}: PaymentFormFieldsProps) => (
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
          id="note"
          name="note"
          label="Uwagi"
          disabled={disabled}
          multiline
          rows={4}
        />

        {children}

        {actions && <div>{actions}</div>}
      </Stack>
    </Flex>
  </Form>
);
