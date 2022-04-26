import { MigrationInterface, QueryRunner } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';

export class SeedOrganization1651005322547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(Organization).insert({
      id: 1,
      name: 'Test OSK',
    });
    await queryRunner.manager.getRepository(Organization).insert({
      id: 2,
      name: 'Other Test OSK',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
