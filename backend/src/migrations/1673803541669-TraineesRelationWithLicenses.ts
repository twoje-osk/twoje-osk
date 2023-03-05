import { MigrationInterface, QueryRunner } from "typeorm";

export class TraineesRelationWithLicenses1673803541669 implements MigrationInterface {
    name = 'TraineesRelationWithLicenses1673803541669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" ADD "driversLicenseCategoryId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "FK_99a7aee5972ef613c22003e8381" FOREIGN KEY ("driversLicenseCategoryId") REFERENCES "drivers_license_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "FK_99a7aee5972ef613c22003e8381"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "driversLicenseCategoryId"`);
    }

}
