import { MigrationInterface, QueryRunner } from "typeorm"

export class MockExamsTriggersAndFunctions1673909700830 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE UNIQUE INDEX questions_amount_unique_index ON mock_exam_questions_amount ("points", "typeId", "categoryId");`
        );
        await queryRunner.query(
            `
            CREATE OR REPLACE FUNCTION update_amount_table_on_question_insert() RETURNS trigger AS $$
                DECLARE
                    question RECORD;
                BEGIN
                    FOR question IN
                        SELECT "points", "typeId"
                        FROM mock_exam_question
                        WHERE Id = NEW."mockExamQuestionId"
                    LOOP
                        UPDATE mock_exam_questions_amount
                            SET "amount" = "amount" + 1
                            WHERE "points" = question."points"
                            AND "typeId"= question."typeId"
                            AND "categoryId" = NEW."driversLicenseCategoryId";
                        IF FOUND THEN
                            CONTINUE;
                        END IF;
                        INSERT INTO mock_exam_questions_amount
                            ("points", "typeId", "categoryId", "amount")
                            VALUES (question."points", question."typeId", NEW."driversLicenseCategoryId", 1);
                    END LOOP;
                    RETURN NULL;
                END
            $$ LANGUAGE plpgsql;
            `
        );
        await queryRunner.query(
            `
            CREATE OR REPLACE FUNCTION update_amount_table_on_question_delete() RETURNS trigger AS $$
            DECLARE
                category RECORD;
                questions_amount integer;
            BEGIN
                FOR category IN
                    SELECT "driversLicenseCategoryId"
                    FROM mock_exam_question_categories_drivers_license_category
                    WHERE "mockExamQuestionId" = OLD."id"
                LOOP
                    SELECT count(*) INTO questions_amount
                    FROM mock_exam_question WHERE id = OLD.id;
                    IF questions_amount > 0 THEN
                        UPDATE mock_exam_questions_amount
                            SET "amount" = "amount" - 1
                            WHERE "points" = OLD."points"
                            AND "typeId" = OLD."typeId"
                            AND "categoryId" = category."driversLicenseCategoryId";
                    END IF;
                END LOOP;
                RETURN OLD;
            END
            $$ LANGUAGE plpgsql;
            `
        );
        await queryRunner.query(
            `
            CREATE OR REPLACE FUNCTION update_amount_table_on_questions_category_update() RETURNS trigger AS $$
                DECLARE
                    question RECORD;
                BEGIN
                    FOR question IN
                        SELECT "points", "typeId"
                        FROM mock_exam_question
                        WHERE Id = NEW."mockExamQuestionId"
                    LOOP
                        UPDATE mock_exam_questions_amount
                            SET "amount" = "amount" + 1
                            WHERE "points" = question.points
                            AND "typeId"= question."typeId"
                            AND "categoryId" = NEW."driversLicenseCategoryId";
                        IF FOUND THEN
                            CONTINUE;
                        END IF;
                        INSERT INTO mock_exam_questions_amount
                            (points, "typeId", "categoryId", amount)
                            VALUES (question.points, question."typeId", NEW."driversLicenseCategoryId", 1);
                    END LOOP;
                    FOR question IN
                        SELECT "points", "typeId"
                        FROM mock_exam_question
                        WHERE Id = OLD."mockExamQuestionId"
                    LOOP
                        UPDATE mock_exam_questions_amount
                            SET "amount" = "amount" - 1
                            WHERE "points" = question."points"
                            AND "typeId"= question."typeId"
                            AND "categoryId" = OLD."driversLicenseCategoryId";
                    END LOOP;
                    RETURN NULL;
                END
            $$ LANGUAGE plpgsql;
            `
        );
        await queryRunner.query(
            `
            CREATE OR REPLACE FUNCTION update_amount_table_on_type_or_points_update() RETURNS trigger AS $$
                DECLARE
                    category RECORD;
                BEGIN
                    FOR category IN
                        SELECT "driversLicenseCategoryId" FROM mock_exam_question_categories_drivers_license_category
                        WHERE "mockExamQuestionId" = OLD."id"
                    LOOP
                        UPDATE mock_exam_questions_amount
                            SET "amount" = "amount" - 1
                            WHERE "points" = OLD."points"
                            AND "typeId"= OLD."typeId"
                            AND "categoryId" = category."driversLicenseCategoryId";
                    END LOOP;
                    FOR category IN
                        SELECT "driversLicenseCategoryId" FROM mock_exam_question_categories_drivers_license_category
                        WHERE "mockExamQuestionId" = NEW."id"
                    LOOP
                        UPDATE mock_exam_questions_amount
                            SET "amount" = "amount" + 1
                            WHERE "points" = NEW."points"
                            AND "typeId" = NEW."typeId"
                            AND "categoryId" = category."driversLicenseCategoryId";
                    END LOOP;
                    RETURN NULL;
                END
            $$ LANGUAGE plpgsql;
            `
        );
        await queryRunner.query(
            `
            CREATE OR REPLACE FUNCTION update_amount_table_on_category_delete() RETURNS trigger AS $$
            DECLARE
                question RECORD;
                category_amount integer;
            BEGIN
                FOR question IN
                    SELECT "points", "typeId"
                    FROM mock_exam_question
                    WHERE "id" = OLD."mockExamQuestionId"
                LOOP
                    SELECT count(*) INTO category_amount
                    FROM mock_exam_question_categories_drivers_license_category
                    WHERE "mockExamQuestionId" = OLD."mockExamQuestionId"
                    AND "driversLicenseCategoryId" = OLD."driversLicenseCategoryId";
                    IF category_amount > 0 THEN
                        UPDATE mock_exam_questions_amount
                            SET "amount" = "amount" - 1
                            WHERE "points" = question."points"
                            AND "typeId" = question."typeId"
                            AND "categoryId" = OLD."driversLicenseCategoryId";
                    END IF;
                END LOOP;
                RETURN OLD;
            END
            $$ LANGUAGE plpgsql;
            `
        );
        await queryRunner.query(
            `       
            CREATE TRIGGER on_type_or_points_update
            AFTER UPDATE
            ON mock_exam_question
            FOR EACH ROW
            WHEN (NEW."points" <> OLD."points" OR NEW."typeId" <> OLD."typeId")
            EXECUTE PROCEDURE update_amount_table_on_type_or_points_update();
            `
        );
        await queryRunner.query(
            `       
            CREATE TRIGGER on_question_insert
            AFTER INSERT
            ON mock_exam_question_categories_drivers_license_category
            FOR EACH ROW
            EXECUTE PROCEDURE update_amount_table_on_question_insert();
            `
        );
        await queryRunner.query(
            `       
            CREATE TRIGGER on_question_delete
            BEFORE DELETE
            ON mock_exam_question
            FOR EACH ROW
            EXECUTE PROCEDURE update_amount_table_on_question_delete();
            `
        );
        await queryRunner.query(
            `       
            CREATE TRIGGER on_questions_category_update
            AFTER UPDATE
            ON mock_exam_question_categories_drivers_license_category
            FOR EACH ROW
            EXECUTE PROCEDURE update_amount_table_on_questions_category_update();
            `
        );
        await queryRunner.query(
            `       
            CREATE TRIGGER on_questions_category_delete
            BEFORE DELETE
            ON mock_exam_question_categories_drivers_license_category
            FOR EACH ROW
            EXECUTE PROCEDURE update_amount_table_on_category_delete();
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('drop index questions_amount_unique_index cascade;')
        await queryRunner.query('drop trigger on_question_insert on mock_exam_question_categories_drivers_license_category cascade;')
        await queryRunner.query('drop trigger on_question_delete on mock_exam_question_categories_drivers_license_category cascade;')
        await queryRunner.query('drop trigger on_questions_category_update on mock_exam_question_categories_drivers_license_category cascade;')
        await queryRunner.query('drop trigger on_questions_category_delete on mock_exam_question_categories_drivers_license_category cascade;')
        await queryRunner.query('drop trigger on_type_or_points_update on mock_exam_question cascade;')
        await queryRunner.query('drop function update_amount_table_on_question_insert() cascade;')
        await queryRunner.query('drop function update_amount_table_on_question_delete() cascade;')
        await queryRunner.query('drop function update_amount_table_on_questions_category_update() cascade;')
        await queryRunner.query('drop function update_amount_table_on_type_or_points_update() cascade;')
        await queryRunner.query('drop function update_amount_table_on_category_change() cascade;')
        
    }

}
