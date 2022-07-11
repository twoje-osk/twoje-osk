export interface UserArguments {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string;
}

export interface UserTraineeArguments extends UserArguments {
  id: number;
}
