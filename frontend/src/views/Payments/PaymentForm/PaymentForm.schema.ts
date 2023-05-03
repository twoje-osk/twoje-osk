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
    amount: Yup.number().required(),
    note: Yup.string().default(''),
    date: Yup.date().required(),
  });
