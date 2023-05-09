import {
  PresentationPaginationArguments,
  PresentationSortArguments,
} from '../utils/presentationArguments';
import { PaymentSortField } from './payments.utils';

export interface PaymentArguments {
  amount: number;
  date: Date;
  note: string;
  idTrainee: number;
}

export interface PaymentArgumentsUpdate
  extends Partial<Omit<PaymentArguments, 'idTrainee'>> {}

export type PaymentPresentationSortArguments =
  PresentationSortArguments<PaymentSortField>;

export interface PaymentPresentationFilterArguments {
  dateFrom?: Date;
  dateTo?: Date;
  note?: string;
  firstName?: string;
  lastName?: string;
}

export interface PaymentPresentationArguments {
  sort: PaymentPresentationSortArguments;
  pagination: PresentationPaginationArguments;
  filter: PaymentPresentationFilterArguments;
}
