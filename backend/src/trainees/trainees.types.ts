import { UserArguments } from '../types/UserArguments';

export interface TraineeArguments {
  user: UserArguments;
  pesel: string | null;
  pkk: string;
  driversLicenseNumber: string | null;
  dateOfBirth: Date;
  driversLicenseCategoryId: number;
}

export interface TraineeArgumentsUpdate
  extends Partial<Omit<TraineeArguments, 'user' | 'dateOfBirth'>> {
  user?: Partial<UserArguments>;
}
