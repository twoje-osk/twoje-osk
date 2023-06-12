import { MigrationInterface, QueryRunner } from "typeorm";

export class paymentDecimalChanges1685654318623 implements MigrationInterface {
    name = 'paymentDecimalChanges1685654318623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount" TYPE numeric(8,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount" TYPE numeric`);
    }

}
