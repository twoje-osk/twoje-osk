import { Trainee } from '../trainees/entities/trainee.entity';
import { Factory } from './seed.utils';

class TraineesFactory extends Factory<Trainee> {
  constructor() {
    super('Trainees');
  }

  public generate() {
    const trainee = new Trainee();

    trainee.pesel = this.faker.random.numeric(11);
    trainee.pkk = this.faker.random.numeric(11);

    this.entities.push(trainee);
    return trainee;
  }
}

export const traineesFactory = new TraineesFactory();

export const seedTrainees = () => undefined;
