export interface PaymentArguments {
  amount: number;
  date: Date;
  idTrainee: number;
}

export interface PaymentArgumentsUpdate extends PaymentArguments {}
