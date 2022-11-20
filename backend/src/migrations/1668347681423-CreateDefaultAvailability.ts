import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDefaultAvailability1668347681423 implements MigrationInterface {
    name = 'CreateDefaultAvailability1668347681423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "default_availability" ("id" SERIAL NOT NULL, "from" TIME NOT NULL, "to" TIME NOT NULL, "dayOfWeek" integer NOT NULL, "instructorId" integer NOT NULL, CONSTRAINT "PK_becb28c02dfebce2e0d0c4d1246" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "default_availability" ADD CONSTRAINT "FK_ba9129652375b943c23a9dc0eee" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "default_availability" DROP CONSTRAINT "FK_ba9129652375b943c23a9dc0eee"`);
        await queryRunner.query(`DROP TABLE "default_availability"`);
    }

}
