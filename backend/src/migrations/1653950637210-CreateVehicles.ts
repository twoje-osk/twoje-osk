import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehicles1653950637210 implements MigrationInterface {
    name = 'CreateVehicles1653950637210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "licensePlate" character varying NOT NULL, "vin" character varying NOT NULL, "dateOfNextCheck" TIMESTAMP NOT NULL, "photo" text, "additionalDetails" text, "notes" text, "organizationId" integer, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_dd963173bbe67e11aadc6615543" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_dd963173bbe67e11aadc6615543"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
    }

}
