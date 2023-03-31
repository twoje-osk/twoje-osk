import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteToPaymentsAndChangeAmountToDecimal1679842604976 implements MigrationInterface {
    name = 'AddNoteToPaymentsAndChangeAmountToDecimal1679842604976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "note" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "note"`);
    }

}
