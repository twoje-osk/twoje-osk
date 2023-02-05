import { MigrationInterface, QueryRunner } from "typeorm"

export class AddAvailabilityFromDefaultsSchedule1671363267427 implements MigrationInterface {
    private async isCronAvailable(queryRunner: QueryRunner): Promise<boolean> {
      const [{ count }] = await queryRunner.query(`SELECT COUNT(*) FROM pg_extension WHERE extname = 'pg_cron'`);

      return count > 0;
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (await this.isCronAvailable(queryRunner)) {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (await this.isCronAvailable(queryRunner)) {
            await queryRunner.query(`SELECT cron.unschedule('add_availability_from_defaults_schedule');`);
        }
    }

}
