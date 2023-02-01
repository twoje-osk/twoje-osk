import { MigrationInterface, QueryRunner } from "typeorm";

export class DisablingOrganizations1675277323599 implements MigrationInterface {
    name = 'DisablingOrganizations1675277323599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "isEnabled" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "isEnabled"`);
    }

}
