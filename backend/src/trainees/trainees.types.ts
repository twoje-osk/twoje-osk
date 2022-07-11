import { UserArguments } from '../types/UserArguments';

export interface TraineeArguments {
  user: UserArguments;
  pesel: string;
  pkk: string;
  driversLicenseNumber: string | null;
}

export interface TraineeArgumentsUpdate
  extends Partial<Omit<TraineeArguments, 'user'>> {
  user?: Partial<UserArguments>;
}
