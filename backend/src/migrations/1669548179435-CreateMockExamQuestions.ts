import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMockExamQuestions1669548179435 implements MigrationInterface {
    name = 'CreateMockExamQuestions1669548179435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mock_exam_question_type" ("id" SERIAL NOT NULL, "scope" character varying NOT NULL, "timeToReadTheQuestion" integer NOT NULL, "timeToAnswer" integer NOT NULL, CONSTRAINT "PK_ec55fb64bd2d7e2e68789cdf7d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mock_exam_question" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "points" integer NOT NULL, "mediaURL" character varying, "mediaReference" character varying, "correctAnswerId" integer, "typeId" integer, CONSTRAINT "REL_089daf207dfbf40e773dcf4a64" UNIQUE ("correctAnswerId"), CONSTRAINT "PK_7ffe7c672e75d2c6703b23a0464" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mock_exam_question_answer" ("id" SERIAL NOT NULL, "answerContent" character varying NOT NULL, "questionId" integer, CONSTRAINT "PK_7b3c5ffe74e44e9db364bfb4ba4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mock_exam_question_categories_drivers_license_category" ("mockExamQuestionId" integer NOT NULL, "driversLicenseCategoryId" integer NOT NULL, CONSTRAINT "PK_f569aa5d019c93898e5e6d0a6e8" PRIMARY KEY ("mockExamQuestionId", "driversLicenseCategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aab31b7c7a24bc2160e645b5e6" ON "mock_exam_question_categories_drivers_license_category" ("mockExamQuestionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b039f8195a20b0d6ccd81e22b6" ON "mock_exam_question_categories_drivers_license_category" ("driversLicenseCategoryId") `);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ADD CONSTRAINT "FK_089daf207dfbf40e773dcf4a64e" FOREIGN KEY ("correctAnswerId") REFERENCES "mock_exam_question_answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ADD CONSTRAINT "FK_7d37ba13382f5ce883bb7756064" FOREIGN KEY ("typeId") REFERENCES "mock_exam_question_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_answer" ADD CONSTRAINT "FK_757b3a967c6f024503a224ed5d1" FOREIGN KEY ("questionId") REFERENCES "mock_exam_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_categories_drivers_license_category" ADD CONSTRAINT "FK_aab31b7c7a24bc2160e645b5e65" FOREIGN KEY ("mockExamQuestionId") REFERENCES "mock_exam_question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_categories_drivers_license_category" ADD CONSTRAINT "FK_b039f8195a20b0d6ccd81e22b64" FOREIGN KEY ("driversLicenseCategoryId") REFERENCES "drivers_license_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_question_categories_drivers_license_category" DROP CONSTRAINT "FK_b039f8195a20b0d6ccd81e22b64"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_categories_drivers_license_category" DROP CONSTRAINT "FK_aab31b7c7a24bc2160e645b5e65"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_answer" DROP CONSTRAINT "FK_757b3a967c6f024503a224ed5d1"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" DROP CONSTRAINT "FK_7d37ba13382f5ce883bb7756064"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" DROP CONSTRAINT "FK_089daf207dfbf40e773dcf4a64e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b039f8195a20b0d6ccd81e22b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aab31b7c7a24bc2160e645b5e6"`);
        await queryRunner.query(`DROP TABLE "mock_exam_question_categories_drivers_license_category"`);
        await queryRunner.query(`DROP TABLE "mock_exam_question_answer"`);
        await queryRunner.query(`DROP TABLE "mock_exam_question"`);
        await queryRunner.query(`DROP TABLE "mock_exam_question_type"`);
    }

}
