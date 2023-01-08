import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTraineeCepikIntegration1669551155436 implements MigrationInterface {
    name = 'CreateTraineeCepikIntegration1669551155436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" ADD "dateOfBirth" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "pesel"`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "pesel" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "pesel"`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "pesel" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "dateOfBirth"`);
    }

}
