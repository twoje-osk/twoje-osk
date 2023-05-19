import { MigrationInterface, QueryRunner } from "typeorm";

export class lengthControlCreationEntitiesAndDTOs1684520390534 implements MigrationInterface {
    name = 'lengthControlCreationEntitiesAndDTOs1684520390534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "name" TYPE character varying(128)`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f"`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "slug" TYPE character varying(64)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "name" TYPE character varying(64)`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "licensePlate" TYPE character varying(7)`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "vin" TYPE character varying(17)`);
        await queryRunner.query(`ALTER TABLE "instructor" ALTER COLUMN "registrationNumber" TYPE character varying(10)`);
        await queryRunner.query(`ALTER TABLE "instructor" ALTER COLUMN "licenseNumber" TYPE character varying(6)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" TYPE character varying(64)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" TYPE character varying(64)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" TYPE character varying(12)`);
        await queryRunner.query(`ALTER TABLE "announcement" ALTER COLUMN "subject" TYPE character varying(512)`);
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "pesel" TYPE character varying(11)`);
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "driversLicenseNumber" TYPE character varying(32)`);
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "pkk" TYPE character varying(20)`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "status" TYPE character varying(255) DEFAULT 'Requested'`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "question" TYPE character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "mediaURL" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "mediaReference" TYPE character varying(128)`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_answer" ALTER COLUMN "answerContent" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount" TYPE numeric(8,2)`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "note" TYPE character varying(256) DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "report_entry_group" DROP CONSTRAINT "UQ_9734f6a1ba3ea5fb2f23cafbbf5"`);
        await queryRunner.query(`ALTER TABLE "report_entry_group" ALTER COLUMN "description" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "report_entry_group" ADD CONSTRAINT "UQ_9734f6a1ba3ea5fb2f23cafbbf5" UNIQUE ("description")`);
        await queryRunner.query(`ALTER TABLE "report_entry" ALTER COLUMN "description" TYPE character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_entry" ALTER COLUMN "description" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "report_entry_group" DROP CONSTRAINT "UQ_9734f6a1ba3ea5fb2f23cafbbf5"`);
        await queryRunner.query(`ALTER TABLE "report_entry_group" ALTER COLUMN "description" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "report_entry_group" ADD CONSTRAINT "UQ_9734f6a1ba3ea5fb2f23cafbbf5" UNIQUE ("description")`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "note" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question_answer" ALTER COLUMN "answerContent" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "mediaReference" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "mediaURL" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "mock_exam_question" ALTER COLUMN "question" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "status" TYPE character varying DEFAULT 'Requested'`);
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "pkk" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "driversLicenseNumber" text`);
        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "pesel" text`);
        await queryRunner.query(`ALTER TABLE "announcement" ALTER COLUMN "subject" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phoneNumber" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "instructor" ALTER COLUMN "licenseNumber" text`);
        await queryRunner.query(`ALTER TABLE "instructor" ALTER COLUMN "registrationNumber" text`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "vin" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "licensePlate" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "name" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f"`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "slug" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "name" TYPE character varying`);
    }

}
