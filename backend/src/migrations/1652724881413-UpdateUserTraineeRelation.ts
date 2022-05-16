import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTraineeRelation1652724881413 implements MigrationInterface {
    name = 'UpdateUserTraineeRelation1652724881413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c2ba9d4186b8241957bb372b14e" FOREIGN KEY ("traineeId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
