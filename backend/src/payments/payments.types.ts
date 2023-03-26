export interface PaymentArguments {
  amount: number;
  date: Date;
  note: string;
  idTrainee: number;
}

export interface PaymentArgumentsUpdate
  extends Partial<Omit<PaymentArguments, 'idTrainee'>> {}
