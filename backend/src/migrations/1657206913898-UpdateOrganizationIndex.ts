import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrganizationIndex1657206913898 implements MigrationInterface {
    name = 'UpdateOrganizationIndex1657206913898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_a08804baa7c5d5427067c49a31"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a08804baa7c5d5427067c49a31" ON "organization" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_a08804baa7c5d5427067c49a31"`);
        await queryRunner.query(`CREATE INDEX "IDX_a08804baa7c5d5427067c49a31" ON "organization" ("slug") `);
    }

}
