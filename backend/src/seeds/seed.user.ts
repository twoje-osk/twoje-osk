import faker from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { getSeedFromString } from './seed.utils';

const getSeedUser = (organizations: Organization[]) => {
  const user = new User();
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.isActive = true;
  user.email = faker.internet.email(user.firstName, user.lastName);
  user.password = bcrypt.hashSync('password', 10);
  user.organization = faker.random.arrayElement(organizations);

  return user;
};

export const getSeedUsers = (organizations: Organization[]) => {
  faker.seed(getSeedFromString('Users'));

  const adminUser = new User();
  adminUser.firstName = 'Admin';
  adminUser.lastName = 'Admin';
  adminUser.isActive = true;
  adminUser.email = 'admin@example.com';
  adminUser.password = bcrypt.hashSync('password', 10);
  adminUser.organization = organizations[0]!;

  const users = Array.from({ length: 9 }, () => getSeedUser(organizations));

  return [adminUser, ...users];
};
