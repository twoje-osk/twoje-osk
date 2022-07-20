import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLessonsAvaillabilityUserContraints1658227719960 implements MigrationInterface {
    name = 'UpdateLessonsAvaillabilityUserContraints1658227719960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_268257c3ce3f52f753184f4ba54"`);
        await queryRunner.query(`ALTER TABLE "availability" ALTER COLUMN "instructorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_ea088d8e194213bfbedae4b5b53"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_23afc4ba250eb890f9689516b69"`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "instructorId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "traineeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "organizationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_268257c3ce3f52f753184f4ba54" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_ea088d8e194213bfbedae4b5b53" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_23afc4ba250eb890f9689516b69" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_23afc4ba250eb890f9689516b69"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_ea088d8e194213bfbedae4b5b53"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_268257c3ce3f52f753184f4ba54"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "organizationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "traineeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "instructorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_23afc4ba250eb890f9689516b69" FOREIGN KEY ("traineeId") REFERENCES "trainee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_ea088d8e194213bfbedae4b5b53" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ALTER COLUMN "instructorId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_268257c3ce3f52f753184f4ba54" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
