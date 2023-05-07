import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavouriteVehicles1675269195605 implements MigrationInterface {
    name = 'AddFavouriteVehicles1675269195605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "instructor_favourite_vehicles_vehicle" ("instructorId" integer NOT NULL, "vehicleId" integer NOT NULL, CONSTRAINT "PK_8c062aa08170fa91fe4454ad4c5" PRIMARY KEY ("instructorId", "vehicleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6984e5a3e4ae0ac13c6113bb6e" ON "instructor_favourite_vehicles_vehicle" ("instructorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_91a12fd17088336453d2d44655" ON "instructor_favourite_vehicles_vehicle" ("vehicleId") `);
        await queryRunner.query(`ALTER TABLE "instructor_favourite_vehicles_vehicle" ADD CONSTRAINT "FK_6984e5a3e4ae0ac13c6113bb6e9" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "instructor_favourite_vehicles_vehicle" ADD CONSTRAINT "FK_91a12fd17088336453d2d44655b" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor_favourite_vehicles_vehicle" DROP CONSTRAINT "FK_91a12fd17088336453d2d44655b"`);
        await queryRunner.query(`ALTER TABLE "instructor_favourite_vehicles_vehicle" DROP CONSTRAINT "FK_6984e5a3e4ae0ac13c6113bb6e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91a12fd17088336453d2d44655"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6984e5a3e4ae0ac13c6113bb6e"`);
        await queryRunner.query(`DROP TABLE "instructor_favourite_vehicles_vehicle"`);
    }

}
