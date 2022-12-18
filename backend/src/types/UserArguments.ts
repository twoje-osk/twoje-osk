export interface UserArguments {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  phoneNumber: string;
  password?: string;
}

export interface UserTraineeArguments extends UserArguments {
  id: number;
}
