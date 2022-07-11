import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUpdateDisableTrainees1657574674081 implements MigrationInterface {
    name = 'CreateUpdateDisableTrainees1657574674081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a08804baa7c5d5427067c49a31"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "driversLicenseNumber"`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "driversLicenseNumber" text`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a08804baa7c5d5427067c49a31" ON "organization" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a08804baa7c5d5427067c49a31"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "driversLicenseNumber"`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "driversLicenseNumber" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_a08804baa7c5d5427067c49a31" ON "organization" ("slug") `);
    }

}
