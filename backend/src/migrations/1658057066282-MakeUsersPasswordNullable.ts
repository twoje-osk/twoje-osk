import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUsersPasswordNullable1658057066282 implements MigrationInterface {
    name = 'MakeUsersPasswordNullable1658057066282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
    }

}
