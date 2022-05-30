import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehicles1653932337420 implements MigrationInterface {
    name = 'CreateVehicles1653932337420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "licensePlate" character varying NOT NULL, "notes" character varying NOT NULL, "organizationId" integer, CONSTRAINT "UQ_a654a0355ae4c5ba31c5f6c8925" UNIQUE ("licensePlate"), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_dd963173bbe67e11aadc6615543" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_dd963173bbe67e11aadc6615543"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
    }

}
