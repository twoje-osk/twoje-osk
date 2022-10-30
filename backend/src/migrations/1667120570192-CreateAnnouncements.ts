import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnnouncements1667120570192 implements MigrationInterface {
    name = 'CreateAnnouncements1667120570192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "announcement" ("id" SERIAL NOT NULL, "subject" character varying NOT NULL, "body" character varying NOT NULL, "createdById" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_e0ef0550174fd1099a308fd18a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "announcement" ADD CONSTRAINT "FK_30893a8cb5ee25374cfd9de9273" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "announcement" DROP CONSTRAINT "FK_30893a8cb5ee25374cfd9de9273"`);
        await queryRunner.query(`DROP TABLE "announcement"`);
    }

}
