import { MigrationInterface, QueryRunner } from 'typeorm';
import faker from '@faker-js/faker';
import { User } from '../user/entities/user.entity';
import { getSeedFromString } from '../utils/getSeedFromString';

faker.seed(getSeedFromString('User'));

export class SeedUser1650406702165 implements MigrationInterface {
  private createUser = (id: number) => {
    const user = new User();
    user.id = id;
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.isActive = true;

    return user;
  };

  private getSeededUsers = () => {
    return Array.from({ length: 10 }, (_, i) => this.createUser(i + 1));
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(User).insert(this.getSeededUsers());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
