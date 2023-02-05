import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScoring1675278173228 implements MigrationInterface {
    name = 'AddScoring1675278173228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ADD "score" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" ADD "isPassed" boolean NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."mock_exam_question_attempt_status_enum" AS ENUM('correct', 'incorrect', 'unanswered')`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_attempt" ADD "status" "public"."mock_exam_question_attempt_status_enum" NOT NULL DEFAULT 'unanswered'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mock_exam_question_attempt" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."mock_exam_question_attempt_status_enum"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" DROP COLUMN "isPassed"`);
        await queryRunner.query(`ALTER TABLE "mock_exam_attempt" DROP COLUMN "score"`);
    }

}
