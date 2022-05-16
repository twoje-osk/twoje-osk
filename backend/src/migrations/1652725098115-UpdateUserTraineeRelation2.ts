import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTraineeRelation21652725098115 implements MigrationInterface {
    name = 'UpdateUserTraineeRelation21652725098115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "traineeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "traineeId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e" UNIQUE ("traineeId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
