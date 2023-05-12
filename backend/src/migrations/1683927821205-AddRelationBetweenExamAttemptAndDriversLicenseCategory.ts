import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationBetweenExamAttemptAndDriversLicenseCategory1683927821205 implements MigrationInterface {
    name = 'AddRelationBetweenExamAttemptAndDriversLicenseCategory1683927821205'
    private async checkIfMockExamAttemptsExist(queryRunner: QueryRunner) {
        const [{ exists }] = await queryRunner.query(`SELECT EXISTS(SELECT id FROM "mock_exam_attempt");`);

        return exists === true;
    }

    private async getBDriversCategory(queryRunner: QueryRunner): Promise<number> {
        const [driversLicenseCategory] = await queryRunner.query(`SELECT id FROM "drivers_license_category" WHERE "name" = 'B'`);
        const id = driversLicenseCategory?.id;

        if (id === undefined) {
            throw new Error("Cannot find 'B' driver's license category");
        }

        return id;
    }
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ADD "categoryId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ADD CONSTRAINT "FK_1186bf72ef8a012bdeb7b7c8b04" FOREIGN KEY ("categoryId") REFERENCES "drivers_license_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        const doAttemptsExist = await this.checkIfMockExamAttemptsExist(queryRunner)

        if (doAttemptsExist) {
            const defaultDriversCategoryId = await this.getBDriversCategory(queryRunner);
            await queryRunner.query(`UPDATE "mock_exam_attempt" SET "categoryId" = $1`, [defaultDriversCategoryId] );
        }

        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ALTER COLUMN "categoryId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" DROP CONSTRAINT "FK_1186bf72ef8a012bdeb7b7c8b04"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" DROP COLUMN "categoryId"`);
    }

}
