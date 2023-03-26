import * as Yup from 'yup';
import { setupYupLocale } from '../../../utils/setupYupLocale';

export interface PaymentForNewInitialData {
  amount?: number;
  note: string;
  date: Date;
  traineeId?: number;
}

export interface PaymentFormNewData {
  amount: number;
  note: string;
  date: Date;
  traineeId: number;
}

setupYupLocale();
export const paymentFormNewSchema: Yup.SchemaOf<PaymentFormNewData> =
  Yup.object().shape({
    amount: Yup.number().required(),
    note: Yup.string().default(''),
    date: Yup.date().required(),
    traineeId: Yup.number().required(),
  });
