import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVehicles1653432043000 implements MigrationInterface {
    name = 'CreateVehicles1653432043000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "organizationId" integer`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_dd963173bbe67e11aadc6615543" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_dd963173bbe67e11aadc6615543"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "organizationId"`);
    }

}
