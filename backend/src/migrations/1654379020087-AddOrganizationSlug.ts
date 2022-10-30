import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrganizationSlug1654379020087 implements MigrationInterface {
    name = 'AddOrganizationSlug1654379020087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f" UNIQUE ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_a08804baa7c5d5427067c49a31" ON "organization" ("slug") `);
        await queryRunner.query(`UPDATE organization SET slug = replace(LOWER(name), ' ', '-')`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "slug" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP INDEX "IDX_a08804baa7c5d5427067c49a31"`);
      await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f"`);
      await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "slug"`);
    }

}
