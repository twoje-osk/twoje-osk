import { MigrationInterface, QueryRunner } from "typeorm"

export class AddAvailabilityFromDefaultsFunction1668946620156 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
`
CREATE OR REPLACE FUNCTION add_availability_from_defaults()
    returns boolean
    language plpgsql
as
$$
DECLARE
    INSTRUCTOR_ROW RECORD;
    AVAILABILITY_COUNT INT;
    DEFAULT_AVAILABILITY_ROW RECORD;

    START_OF_NEXT_WEEK timestamp;
    FROM_DATETIME timestamp;
    TO_DATETIME timestamp;
BEGIN
    SELECT date_trunc('week', current_date + INTERVAL '1 week') INTO START_OF_NEXT_WEEK;

    FOR INSTRUCTOR_ROW IN
       SELECT u.email, i.id as instructorId, u.id as userId FROM "instructor" i
            JOIN "user" u on i.id = u."instructorId"
            WHERE u."isActive" = true
    LOOP
        SELECT count(*) INTO AVAILABILITY_COUNT FROM availability
            WHERE "instructorId" = INSTRUCTOR_ROW.instructorId
                AND "from" > current_date
                AND "to" < (
                    SELECT current_date + INTERVAL '1 week'
                );

        IF (AVAILABILITY_COUNT > 0) THEN
            CONTINUE;
        END IF;

        FOR DEFAULT_AVAILABILITY_ROW IN
           SELECT * FROM "default_availability" da WHERE da."instructorId" = INSTRUCTOR_ROW.instructorId
        LOOP
            FROM_DATETIME := START_OF_NEXT_WEEK + DEFAULT_AVAILABILITY_ROW."from" + DEFAULT_AVAILABILITY_ROW."dayOfWeek" * INTERVAL '1 day';
            TO_DATETIME := START_OF_NEXT_WEEK + DEFAULT_AVAILABILITY_ROW."to" + DEFAULT_AVAILABILITY_ROW."dayOfWeek" * INTERVAL '1 day';

            INSERT INTO availability ("from", "to", "userDefined", "instructorId")
                VALUES (
                    FROM_DATETIME,
                    TO_DATETIME,
                    false,
                    INSTRUCTOR_ROW.instructorId
              );
        END LOOP;
    END LOOP;

    RETURN TRUE;
END
$$;
`,
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('drop function add_availability_from_defaults;')
    }

}
