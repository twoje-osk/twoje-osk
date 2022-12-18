import { MigrationInterface, QueryRunner } from "typeorm"

export class AddAvailabilityFromDefaultsSchedule1671363267427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
`
SELECT cron.schedule(
  'add_availability_from_defaults_schedule',
  '0 3 * * 0',
  $$SELECT "add_availability_from_defaults"()$$
);
`
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`SELECT cron.unschedule('add_availability_from_defaults_schedule');`);
    }

}
