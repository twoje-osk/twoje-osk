import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeNameOfCategoryUnique1657969594229 implements MigrationInterface {
    name = 'MakeNameOfCategoryUnique1657969594229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers_license_category" ADD CONSTRAINT "UQ_79c0017711f8c5c6650b5c6d9a6" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drivers_license_category" DROP CONSTRAINT "UQ_79c0017711f8c5c6650b5c6d9a6"`);
    }

}
