import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateResetPasswordToken1664726704486 implements MigrationInterface {
    name = 'CreateResetPasswordToken1664726704486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_password_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "isValid" boolean NOT NULL, "expireDate" TIMESTAMP NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c6f6eb8f5c88ac0233eceb8d385" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_609174ec22ebfd1b8dd71f867a" ON "reset_password_token" ("token") `);
        await queryRunner.query(`ALTER TABLE "reset_password_token" ADD CONSTRAINT "FK_3fde3055d9d16236c05d030915e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reset_password_token" DROP CONSTRAINT "FK_3fde3055d9d16236c05d030915e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_609174ec22ebfd1b8dd71f867a"`);
        await queryRunner.query(`DROP TABLE "reset_password_token"`);
    }

}
