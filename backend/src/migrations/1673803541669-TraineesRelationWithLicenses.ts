import { MigrationInterface, QueryRunner } from "typeorm";

export class TraineesRelationWithLicenses1673803541669 implements MigrationInterface {
    name = 'TraineesRelationWithLicenses1673803541669'

    private async checkIfTraineesExist(queryRunner: QueryRunner) {
      const [{ exists }] = await queryRunner.query(`SELECT EXISTS(SELECT id FROM trainee);`);

      return exists === true;
    }

    private async getBDriversCategory(queryRunner: QueryRunner): Promise<number> {
      const [driversLicenseCategory] = await queryRunner.query(`SELECT id FROM "drivers_license_category" WHERE "name" = 'B'`);
      const id = driversLicenseCategory?.id;

      if (id === undefined) {
        throw new Error("Cannot find 'B' driver's license category");
      }

      return id;
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" ADD "driversLicenseCategoryId" integer`);
        await queryRunner.query(`ALTER TABLE "trainee" ADD CONSTRAINT "FK_99a7aee5972ef613c22003e8381" FOREIGN KEY ("driversLicenseCategoryId") REFERENCES "drivers_license_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        const doTraineesExist = await this.checkIfTraineesExist(queryRunner)

        if (doTraineesExist) {
          const defaultDriversCategoryId = await this.getBDriversCategory(queryRunner);
          await queryRunner.query(`UPDATE trainee SET "driversLicenseCategoryId" = $1`, [defaultDriversCategoryId] );
        }

        await queryRunner.query(`ALTER TABLE "trainee" ALTER COLUMN "driversLicenseCategoryId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trainee" DROP CONSTRAINT "FK_99a7aee5972ef613c22003e8381"`);
        await queryRunner.query(`ALTER TABLE "trainee" DROP COLUMN "driversLicenseCategoryId"`);
    }

}
