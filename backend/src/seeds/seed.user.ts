import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { instructorsFactory } from './seed.instructors';
import { organizationsFactory } from './seed.organization';
import { traineesFactory } from './seed.trainees';
import { Factory } from './seed.utils';

const getUserType = (n: number) => {
  if (n < 0.05) {
    return 'admin';
  }

  if (n < 0.2) {
    return 'instructor';
  }

  return 'trainee';
};

class UserFactory extends Factory<User> {
  constructor() {
    super('User');
  }

  public generate() {
    const user = new User();
    user.firstName = this.faker.name.firstName();
    user.lastName = this.faker.name.lastName();
    user.isActive = true;
    user.email = this.faker.internet.email(user.firstName, user.lastName);
    user.password = bcrypt.hashSync('password', 10);
    user.organization = this.faker.helpers.arrayElement(
      organizationsFactory.getAll(),
    );
    user.phoneNumber = this.faker.phone.phoneNumber('### ### ###');
    user.createdAt = new Date();

    const userType = getUserType(
      this.faker.datatype.number({
        max: 1,
        min: 0,
        precision: 0.0000001,
      }),
    );

    if (userType === 'trainee') {
      user.trainee = traineesFactory.generate();
    }

    if (userType === 'instructor') {
      user.instructor = instructorsFactory.generate();
    }

    this.entities.push(user);

    return user;
  }

  public generateFromData({ trainee, instructor, ...data }: Partial<User>) {
    const user = super.generateFromData(data);

    if (user.trainee !== null) {
      traineesFactory.remove(user.trainee!);
      user.trainee = null;
    }
    if (trainee !== undefined && trainee !== null) {
      user.trainee = trainee;
    }

    if (user.instructor !== null) {
      instructorsFactory.remove(user.instructor!);
      user.instructor = null;
    }
    if (instructor !== undefined && instructor !== null) {
      user.instructor = instructor;
    }

    return user;
  }
}

export const usersFactory = new UserFactory();

export const seedUsers = () => {
  usersFactory.generateFromData({
    firstName: 'Admin',
    lastName: 'Admin',
    isActive: true,
    email: 'admin@example.com',
    password: bcrypt.hashSync('password', 10),
    organization: organizationsFactory.getAll()[0],
  });

  Array.from({ length: 300 }).forEach(() => usersFactory.generate());
};
