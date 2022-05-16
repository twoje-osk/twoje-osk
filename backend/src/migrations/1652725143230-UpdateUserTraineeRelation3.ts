import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTraineeRelation31652725143230 implements MigrationInterface {
    name = 'UpdateUserTraineeRelation31652725143230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "UQ_eaeed73e1208ddfd0f16a72aae8" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "FK_eaeed73e1208ddfd0f16a72aae8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "FK_eaeed73e1208ddfd0f16a72aae8"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "UQ_eaeed73e1208ddfd0f16a72aae8"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "userId"`);
    }

}
