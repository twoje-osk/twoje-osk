import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePasswordOptional1664719850851 implements MigrationInterface {
    name = 'MakePasswordOptional1664719850851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`UPDATE "user" SET password='' WHERE "password" IS NULL;`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
    }

}
