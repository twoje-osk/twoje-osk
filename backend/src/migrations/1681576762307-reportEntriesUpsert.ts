import { MigrationInterface, QueryRunner } from "typeorm";

export class reportEntriesUpsert1681576762307 implements MigrationInterface {
    name = 'reportEntriesUpsert1681576762307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_entry_to_course_report" ADD CONSTRAINT "courseReportToReportEntry" UNIQUE ("courseReportId", "reportEntryId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_entry_to_course_report" DROP CONSTRAINT "courseReportToReportEntry"`);
    }

}
