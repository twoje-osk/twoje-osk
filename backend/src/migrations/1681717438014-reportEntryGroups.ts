import { MigrationInterface, QueryRunner } from "typeorm";

export class reportEntryGroups1681717438014 implements MigrationInterface {
    name = 'reportEntryGroups1681717438014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report_entry_group" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_0e6ccc5e9f0b91e7754ac01a159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report_entry" ADD "reportEntryGroupId" integer`);
        await queryRunner.query(`ALTER TABLE "report_entry" ADD CONSTRAINT "FK_fe1f02edd7a401c2479113a6bb3" FOREIGN KEY ("reportEntryGroupId") REFERENCES "report_entry_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_entry" DROP CONSTRAINT "FK_fe1f02edd7a401c2479113a6bb3"`);
        await queryRunner.query(`ALTER TABLE "report_entry" DROP COLUMN "reportEntryGroupId"`);
        await queryRunner.query(`DROP TABLE "report_entry_group"`);
    }

}
