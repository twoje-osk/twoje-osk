import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehicles1652990197933 implements MigrationInterface {
    name = 'CreateVehicles1652990197933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "licensePlate" character varying NOT NULL, "notes" character varying NOT NULL, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vehicle"`);
    }

}
