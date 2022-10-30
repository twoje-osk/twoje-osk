import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentMigration1667129320965 implements MigrationInterface {
    name = 'PaymentMigration1667129320965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "date" TIMESTAMP NOT NULL, "traineeId" integer, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_5b4c11408e0380f93d5931f91af" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_5b4c11408e0380f93d5931f91af"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
