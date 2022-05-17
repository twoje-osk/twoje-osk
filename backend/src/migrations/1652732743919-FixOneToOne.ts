import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOneToOne1652732743919 implements MigrationInterface {
    name = 'FixOneToOne1652732743919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "FK_eaeed73e1208ddfd0f16a72aae8"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "UQ_eaeed73e1208ddfd0f16a72aae8"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "traineeId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e" UNIQUE ("traineeId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "traineeId"`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "UQ_eaeed73e1208ddfd0f16a72aae8" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "FK_eaeed73e1208ddfd0f16a72aae8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
