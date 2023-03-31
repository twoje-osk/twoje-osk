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
    payment.date = this.faker.date.past(1);
    // eslint-disable-next-line prefer-destructuring
    payment.trainee = traineesFactory.getAll()[0]!;

    if (this.faker.datatype.float({ min: 0, max: 1 }) < 0.8) {
      payment.note = this.faker.lorem.sentence(
        this.faker.datatype.number({
          min: 3,
          max: 5,
          precision: 1,
        }),
      );
    }

    this.entities.push(payment);
    return payment;
  }
}
export const paymentsFactory = new PaymentsFactory();

export const seedPayments = () =>
  Array.from({ length: 10 }).map(() => paymentsFactory.generate());
