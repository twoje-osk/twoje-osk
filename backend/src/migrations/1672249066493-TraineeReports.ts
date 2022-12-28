import { MigrationInterface, QueryRunner } from "typeorm";

export class TraineeReports1672249066493 implements MigrationInterface {
    name = 'TraineeReports1672249066493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_report" ("id" SERIAL NOT NULL, "reportId" integer NOT NULL, CONSTRAINT "PK_b38e652f8697abd704e3f8c9b60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_entry" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "reportId" integer NOT NULL, CONSTRAINT "PK_7780a5d23abd8c9e8e0d9f61ec7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_entry_to_course_report" ("id" SERIAL NOT NULL, "done" boolean NOT NULL DEFAULT false, "mastered" boolean NOT NULL DEFAULT false, "courseReportId" integer NOT NULL, "reportEntryId" integer NOT NULL, CONSTRAINT "PK_f5aa04121de74de7025a3494387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL, "driversLicenseCategoryId" integer NOT NULL, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course_report" ADD CONSTRAINT "FK_c65c76a6a93adb1f0f91c72f7db" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_entry" ADD CONSTRAINT "FK_597611e6f2ad938cf2d65ba0f8a" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_entry_to_course_report" ADD CONSTRAINT "FK_5a20f27164cdd4dfdec35f0911a" FOREIGN KEY ("courseReportId") REFERENCES "course_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_entry_to_course_report" ADD CONSTRAINT "FK_c3a101ec82d48e85e6b6647b549" FOREIGN KEY ("reportEntryId") REFERENCES "report_entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_c72ffcc99abd57c8176e4124277" FOREIGN KEY ("driversLicenseCategoryId") REFERENCES "drivers_license_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_c72ffcc99abd57c8176e4124277"`);
        await queryRunner.query(`ALTER TABLE "report_entry_to_course_report" DROP CONSTRAINT "FK_c3a101ec82d48e85e6b6647b549"`);
        await queryRunner.query(`ALTER TABLE "report_entry_to_course_report" DROP CONSTRAINT "FK_5a20f27164cdd4dfdec35f0911a"`);
        await queryRunner.query(`ALTER TABLE "report_entry" DROP CONSTRAINT "FK_597611e6f2ad938cf2d65ba0f8a"`);
        await queryRunner.query(`ALTER TABLE "course_report" DROP CONSTRAINT "FK_c65c76a6a93adb1f0f91c72f7db"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "report_entry_to_course_report"`);
        await queryRunner.query(`DROP TABLE "report_entry"`);
        await queryRunner.query(`DROP TABLE "course_report"`);
    }

}
