import { Trainee } from '../trainees/entities/trainee.entity';
import { driversLicenseCategoriesFactory } from './seed.driversLicenseCategories';
import { Factory } from './seed.utils';

class TraineesFactory extends Factory<Trainee> {
  constructor() {
    super(Trainee);
  }

  public generate() {
    const trainee = new Trainee();

    trainee.pesel = this.faker.datatype.boolean()
      ? this.faker.random.numeric(11)
      : null;
    trainee.pkk = this.faker.random.numeric(20);
    trainee.dateOfBirth = this.faker.date.past();

    trainee.driversLicenseCategory = driversLicenseCategoriesFactory
      .getAll()
      .find((category) => category.name === 'B')!;

    this.entities.push(trainee);
    return trainee;
  }
}

export const traineesFactory = new TraineesFactory();

export const seedTrainees = () => undefined;
