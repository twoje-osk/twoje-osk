import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteToPayments1679835937979 implements MigrationInterface {
    name = 'AddNoteToPayments1679835937979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "note" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "note"`);
    }

}
