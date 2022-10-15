export interface UserArguments {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string;
}

export interface UserTraineeArguments extends UserArguments {
  id: number;
}
