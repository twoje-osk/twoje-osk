import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDriversLicenseNumberNullable1652730752920 implements MigrationInterface {
    name = 'MakeDriversLicenseNumberNullable1652730752920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "driversLicenseNumber" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "driversLicenseNumber" SET NOT NULL`);
    }

}
