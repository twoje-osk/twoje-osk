import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInstructor1653421544169 implements MigrationInterface {
    name = 'CreateInstructor1653421544169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "instructor" ("id" SERIAL NOT NULL, CONSTRAINT "PK_ccc0348eefb581ca002c05ef2f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "instructorId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_5c4560669122d68310b3671618d" UNIQUE ("instructorId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5c4560669122d68310b3671618d" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5c4560669122d68310b3671618d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_5c4560669122d68310b3671618d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instructorId"`);
        await queryRunner.query(`DROP TABLE "instructor"`);
    }

}
