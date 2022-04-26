import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrainee1651006745833 implements MigrationInterface {
    name = 'CreateTrainee1651006745833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trainee" ("id" SERIAL NOT NULL, CONSTRAINT "PK_7bb8bcb39effdfc30d4f67e9eb8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "traineeId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e" UNIQUE ("traineeId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e" FOREIGN KEY ("traineeId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "traineeId"`);
        await queryRunner.query(`DROP TABLE "trainee"`);
    }

}
