import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface PaymentFormInitialData {
  amount?: number;
  note: string;
  date: Date;
}

export interface PaymentFormData {
  amount: number;
  note: string;
  date: Date;
}

setupYupLocale();
export const paymentFormSchema: Yup.SchemaOf<PaymentFormData> =
  Yup.object().shape({
    amount: Yup.number().required().max(100_000),
    note: Yup.string().default('').max(256),
    date: Yup.date().required(),
  });
