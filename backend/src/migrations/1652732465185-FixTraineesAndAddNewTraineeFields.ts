import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTraineesAndAddNewTraineeFields1652732465185 implements MigrationInterface {
    name = 'FixTraineesAndAddNewTraineeFields1652732465185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "traineeId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "pesel" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "driversLicenseNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "pkk" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "UQ_eaeed73e1208ddfd0f16a72aae8" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "FK_eaeed73e1208ddfd0f16a72aae8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "FK_eaeed73e1208ddfd0f16a72aae8"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "UQ_eaeed73e1208ddfd0f16a72aae8"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "pkk"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "driversLicenseNumber"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "pesel"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "traineeId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_c2ba9d4186b8241957bb372b14e" UNIQUE ("traineeId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e" FOREIGN KEY ("traineeId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
