import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhotoToInstructor1657232603324 implements MigrationInterface {
    name = 'AddPhotoToInstructor1657232603324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a08804baa7c5d5427067c49a31"`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD "photo" text`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a08804baa7c5d5427067c49a31" ON "organization" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a08804baa7c5d5427067c49a31"`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP COLUMN "photo"`);
        await queryRunner.query(`CREATE INDEX "IDX_a08804baa7c5d5427067c49a31" ON "organization" ("slug") `);
    }

}
