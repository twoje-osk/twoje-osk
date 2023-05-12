import { MigrationInterface, QueryRunner } from "typeorm";

export class VehiclesUpdate1683900582465 implements MigrationInterface {
    name = 'VehiclesUpdate1683900582465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_dd963173bbe67e11aadc6615543"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "organizationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_dd963173bbe67e11aadc6615543" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_dd963173bbe67e11aadc6615543"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "organizationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_dd963173bbe67e11aadc6615543" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
