import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMockExamAttempts1669561249691 implements MigrationInterface {
    name = 'CreateMockExamAttempts1669561249691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mock_exam_attempt" ("id" SERIAL NOT NULL, "attemptDate" TIMESTAMP NOT NULL, "traineeId" integer, CONSTRAINT "PK_1a0f47db1ad33bc3f471087009f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mock_exam_attempt_question_entity" ("id" SERIAL NOT NULL, "questionId" integer, "attemptId" integer, "answerId" integer, CONSTRAINT "PK_88b8d1b135a657684f5b96ae7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ADD CONSTRAINT "FK_cf24af2b251d6fae17e94528641" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt_question_entity" ADD CONSTRAINT "FK_650d18c0357028aa0f8ea3f0ca6" FOREIGN KEY ("questionId") REFERENCES "mock_exam_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt_question_entity" ADD CONSTRAINT "FK_85719138ace66b7ae95846a84eb" FOREIGN KEY ("attemptId") REFERENCES "mock_exam_attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt_question_entity" ADD CONSTRAINT "FK_e131fa09a7a7e1a89afceff2b06" FOREIGN KEY ("answerId") REFERENCES "mock_exam_question_answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt_question_entity" DROP CONSTRAINT "FK_e131fa09a7a7e1a89afceff2b06"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt_question_entity" DROP CONSTRAINT "FK_85719138ace66b7ae95846a84eb"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt_question_entity" DROP CONSTRAINT "FK_650d18c0357028aa0f8ea3f0ca6"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" DROP CONSTRAINT "FK_cf24af2b251d6fae17e94528641"`);
        await queryRunner.query(`DROP TABLE "mock_exam_attempt_question_entity"`);
        await queryRunner.query(`DROP TABLE "mock_exam_attempt"`);
    }

}
