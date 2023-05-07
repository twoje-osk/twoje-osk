import { UserArguments } from '../types/UserArguments';
import {
  PresentationPaginationArguments,
  PresentationSortArguments,
} from '../utils/presentationArguments';
import { TraineeSortField, TraineeUserSortField } from './trainee.utils';

export interface TraineeArguments {
  user: UserArguments;
  pesel: string | null;
  pkk: string;
  driversLicenseNumber: string | null;
  dateOfBirth: Date;
}

export interface TraineeArgumentsUpdate
  extends Partial<Omit<TraineeArguments, 'user' | 'dateOfBirth'>> {
  user?: Partial<UserArguments>;
}

export type TraineePresentationSortArguments = PresentationSortArguments<
  TraineeUserSortField | TraineeSortField
>;

export interface TraineePresentationFilterArguments {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface TraineePresentationArguments {
  sort: TraineePresentationSortArguments;
  pagination: PresentationPaginationArguments;
  filter: TraineePresentationFilterArguments;
}
