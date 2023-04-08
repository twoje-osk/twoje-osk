import { MigrationInterface, QueryRunner } from "typeorm";

export class reportEntriesUpsert1680962389057 implements MigrationInterface {
    name = 'reportEntriesUpsert1680962389057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e0b79e4eb829e49c174d0c5f4e" ON "report_entry_to_course_report" ("courseReportId", "reportEntryId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e0b79e4eb829e49c174d0c5f4e"`);
    }

}
