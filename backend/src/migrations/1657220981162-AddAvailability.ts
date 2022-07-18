import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvailability1657220981162 implements MigrationInterface {
    name = 'AddAvailability1657220981162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "from" TIMESTAMP NOT NULL, "to" TIMESTAMP NOT NULL, "instructorId" integer, "traineeId" integer, "vehicleId" integer, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "availability" ("id" SERIAL NOT NULL, "from" TIMESTAMP NOT NULL, "to" TIMESTAMP NOT NULL, "userDefined" boolean NOT NULL DEFAULT true, "instructorId" integer, CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_ea088d8e194213bfbedae4b5b53" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_23afc4ba250eb890f9689516b69" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_3aa8fe24fc5f663036880ac92e9" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_268257c3ce3f52f753184f4ba54" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_268257c3ce3f52f753184f4ba54"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_3aa8fe24fc5f663036880ac92e9"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_23afc4ba250eb890f9689516b69"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_ea088d8e194213bfbedae4b5b53"`);
        await queryRunner.query(`DROP TABLE "availability"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
    }

}
