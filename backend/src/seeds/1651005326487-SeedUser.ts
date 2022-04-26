import { MigrationInterface, QueryRunner } from 'typeorm';
import faker from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { getSeedFromString } from '../utils/getSeedFromString';
import { Organization } from '../organizations/entities/organization.entity';

faker.seed(getSeedFromString('User'));

export class SeedUser1651005326487 implements MigrationInterface {
  private createUser = (id: number, organizations: Organization[]) => {
    const user = new User();
    user.id = id;
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.isActive = true;
    user.email = faker.internet.email(user.firstName, user.lastName);
    user.password = bcrypt.hashSync('password', 10);
    user.organization = faker.random.arrayElement(organizations);

    return user;
  };

  private getSeededUsers = (organizations: Organization[]) => {
    return Array.from({ length: 10 }, (_, i) =>
      this.createUser(i + 1, organizations),
    );
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    const organizations = await queryRunner.manager
      .getRepository(Organization)
      .find();
    await queryRunner.manager.getRepository(User).insert({
      firstName: 'Admin',
      lastName: 'Admin',
      isActive: true,
      email: 'admin@example.com',
      password: bcrypt.hashSync('password', 10),
      organization: organizations[0],
    });
    await queryRunner.manager
      .getRepository(User)
      .insert(this.getSeededUsers(organizations!));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
