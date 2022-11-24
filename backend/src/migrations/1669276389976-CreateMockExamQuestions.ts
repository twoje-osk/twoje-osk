import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMockExamQuestions1669276389976 implements MigrationInterface {
    name = 'CreateMockExamQuestions1669276389976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mock_exam_question_answer" ("id" SERIAL NOT NULL, "answerContent" character varying NOT NULL, "questionId" integer, CONSTRAINT "PK_7b3c5ffe74e44e9db364bfb4ba4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mock_exam_question_type" ("id" SERIAL NOT NULL, "scope" character varying NOT NULL, "timeToReadTheQuestion" integer NOT NULL, "timeToAnswer" integer NOT NULL, CONSTRAINT "PK_ec55fb64bd2d7e2e68789cdf7d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mock_exam_question" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "points" integer NOT NULL, "mediaURL" character varying NOT NULL, "typeId" integer, CONSTRAINT "PK_7ffe7c672e75d2c6703b23a0464" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_answer" ADD CONSTRAINT "FK_757b3a967c6f024503a224ed5d1" FOREIGN KEY ("questionId") REFERENCES "mock_exam_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ADD CONSTRAINT "FK_7d37ba13382f5ce883bb7756064" FOREIGN KEY ("typeId") REFERENCES "mock_exam_question_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_question" DROP CONSTRAINT "FK_7d37ba13382f5ce883bb7756064"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_answer" DROP CONSTRAINT "FK_757b3a967c6f024503a224ed5d1"`);
        await queryRunner.query(`DROP TABLE "mock_exam_question"`);
        await queryRunner.query(`DROP TABLE "mock_exam_question_type"`);
        await queryRunner.query(`DROP TABLE "mock_exam_question_answer"`);
    }

}
