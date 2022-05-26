import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeVehiclesHaveUniqueLicensePlate1653587563199 implements MigrationInterface {
    name = 'MakeVehiclesHaveUniqueLicensePlate1653587563199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "UQ_a654a0355ae4c5ba31c5f6c8925" UNIQUE ("licensePlate")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "UQ_a654a0355ae4c5ba31c5f6c8925"`);
    }

}
