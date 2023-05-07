import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLectures1683474561355 implements MigrationInterface {
    name = 'AddLectures1683474561355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lecture" ("id" SERIAL NOT NULL, "subject" character varying NOT NULL, "index" integer NOT NULL, "body" character varying NOT NULL, CONSTRAINT "PK_2abef7c1e52b7b58a9f905c9643" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lecture"`);
    }

}
