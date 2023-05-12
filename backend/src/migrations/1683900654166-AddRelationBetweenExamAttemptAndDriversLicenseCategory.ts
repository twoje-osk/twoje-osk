import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationBetweenExamAttemptAndDriversLicenseCategory1683900654166 implements MigrationInterface {
    name = 'AddRelationBetweenExamAttemptAndDriversLicenseCategory1683900654166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ADD CONSTRAINT "FK_1186bf72ef8a012bdeb7b7c8b04" FOREIGN KEY ("categoryId") REFERENCES "drivers_license_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" DROP CONSTRAINT "FK_1186bf72ef8a012bdeb7b7c8b04"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" DROP COLUMN "categoryId"`);
    }

}
