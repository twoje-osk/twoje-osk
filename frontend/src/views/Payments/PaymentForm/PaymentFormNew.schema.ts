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
    amount: Yup.number().required().max(100_000).min(-100_000),
    note: Yup.string().default('').max(256),
    date: Yup.date().required(),
    traineeId: Yup.number().required(),
  });
