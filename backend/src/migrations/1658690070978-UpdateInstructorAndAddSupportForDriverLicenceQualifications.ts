import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInstructorAndAddSupportForDriverLicenceQualifications1658690070978 implements MigrationInterface {
    name = 'UpdateInstructorAndAddSupportForDriverLicenceQualifications1658690070978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "drivers_license_category" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "UQ_79c0017711f8c5c6650b5c6d9a6" UNIQUE ("name"), CONSTRAINT "PK_21d8b8ecf2a8b80f418499d099e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instructor_instructors_qualifications_drivers_license_category" ("instructorId" integer NOT NULL, "driversLicenseCategoryId" integer NOT NULL, CONSTRAINT "PK_7b57c6fa8f1fb6727f955378446" PRIMARY KEY ("instructorId", "driversLicenseCategoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0edbd6938de3e618c553e5a269" ON "instructor_instructors_qualifications_drivers_license_category" ("instructorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_61273963d575e0d62044c17248" ON "instructor_instructors_qualifications_drivers_license_category" ("driversLicenseCategoryId") `);
        await queryRunner.query(`ALTER TABLE "instructor" ADD "registrationNumber" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD "licenseNumber" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instructor" ADD "photo" text`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instructor_instructors_qualifications_drivers_license_category" ADD CONSTRAINT "FK_0edbd6938de3e618c553e5a269b" FOREIGN KEY ("instructorId") REFERENCES "instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "instructor_instructors_qualifications_drivers_license_category" ADD CONSTRAINT "FK_61273963d575e0d62044c172487" FOREIGN KEY ("driversLicenseCategoryId") REFERENCES "drivers_license_category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instructor_instructors_qualifications_drivers_license_category" DROP CONSTRAINT "FK_61273963d575e0d62044c172487"`);
        await queryRunner.query(`ALTER TABLE "instructor_instructors_qualifications_drivers_license_category" DROP CONSTRAINT "FK_0edbd6938de3e618c553e5a269b"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP COLUMN "licenseNumber"`);
        await queryRunner.query(`ALTER TABLE "instructor" DROP COLUMN "registrationNumber"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61273963d575e0d62044c17248"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0edbd6938de3e618c553e5a269"`);
        await queryRunner.query(`DROP TABLE "instructor_instructors_qualifications_drivers_license_category"`);
        await queryRunner.query(`DROP TABLE "drivers_license_category"`);
    }

}
