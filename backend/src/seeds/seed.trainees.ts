import faker from '@faker-js/faker';
import { User } from 'users/entities/user.entity';
import { Trainee } from '../trainees/entities/trainee.entity';
import { getSeedFromString } from './seed.utils';

let seedIndex = 0;
const getSeedTrainee = (users: User[]) => {
  const trainee = new Trainee();

  trainee.user = users[seedIndex]!;
  seedIndex += 1;

  trainee.pesel = faker.random.numeric(11);
  trainee.pkk = faker.random.numeric(11);

  return trainee;
};

export const getSeedTrainees = (users: User[]) => {
  faker.seed(getSeedFromString('Trainees'));

  const trainees = Array.from({ length: 5 }, () => getSeedTrainee(users));

  return trainees;
};
