import { Payment } from '../payments/entities/payment.entity';
import { traineesFactory } from './seed.trainees';
import { Factory } from './seed.utils';

class PaymentsFactory extends Factory<Payment> {
  constructor() {
    super(Payment);
  }

  public generate() {
    const payment = new Payment();

    payment.amount = this.faker.datatype.number({
      max: 2000,
      min: 100,
      precision: 5,
    });
    payment.date = this.faker.date.past(100);
    payment.trainee = this.faker.helpers.arrayElement(traineesFactory.getAll());
    this.entities.push(payment);
    return payment;
  }
}
export const paymentsFactory = new PaymentsFactory();

export const seedPayments = () =>
  Array.from({ length: 100 }).map(() => paymentsFactory.generate());
