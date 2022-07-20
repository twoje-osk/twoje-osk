import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToLesson1657224185624 implements MigrationInterface {
    name = 'AddStatusToLesson1657224185624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD "status" character varying NOT NULL DEFAULT 'Requested'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "status"`);
    }

}
