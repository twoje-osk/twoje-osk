import { MigrationInterface, QueryRunner } from "typeorm";

export class MockExamQuestionsSeeds1669573200079 implements MigrationInterface {
    name = 'MockExamQuestionsSeeds1669573200079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_question" DROP CONSTRAINT "FK_089daf207dfbf40e773dcf4a64e"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" DROP CONSTRAINT "FK_7d37ba13382f5ce883bb7756064"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "correctAnswerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "typeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ADD CONSTRAINT "FK_089daf207dfbf40e773dcf4a64e" FOREIGN KEY ("correctAnswerId") REFERENCES "mock_exam_question_answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ADD CONSTRAINT "FK_7d37ba13382f5ce883bb7756064" FOREIGN KEY ("typeId") REFERENCES "mock_exam_question_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_question" DROP CONSTRAINT "FK_7d37ba13382f5ce883bb7756064"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" DROP CONSTRAINT "FK_089daf207dfbf40e773dcf4a64e"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "typeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "correctAnswerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ADD CONSTRAINT "FK_7d37ba13382f5ce883bb7756064" FOREIGN KEY ("typeId") REFERENCES "mock_exam_question_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ADD CONSTRAINT "FK_089daf207dfbf40e773dcf4a64e" FOREIGN KEY ("correctAnswerId") REFERENCES "mock_exam_question_answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
