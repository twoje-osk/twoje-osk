import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTrainee1652730623151 implements MigrationInterface {
    name = 'UpdateTrainee1652730623151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" ADD "pesel" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "driversLicenseNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "pkk" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "pkk"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "driversLicenseNumber"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "pesel"`);
    }

}
