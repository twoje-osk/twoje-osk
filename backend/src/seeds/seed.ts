import { EntityManager } from 'typeorm';
import { dataSource } from '../data-source';
import { seedUsers } from './seed.user';
import { seedOrganizations } from './seed.organization';
import { seedTrainees } from './seed.trainees';
import { seedVehicles } from './seed.vehicles';
import { seedInstructors } from './seed.instructors';
import { seedAvailabilities } from './seed.availabilities';
import { seedLessons } from './seed.lessons';
import { seedPayments } from './seed.payments';
import { Factory } from './seed.utils';
import { seedDriversLicenseCategories } from './seed.driversLicenseCategories';
import { seedAnnouncements } from './seed.announcement';
import { seedDefaultAvailabilities } from './seed.defaultAvailabilities';
import { seedMockExamQuestionTypes } from './seed.mockExamQuestionType';

const clearSequences = async (trx: EntityManager) => {
  await trx.query(`
    SELECT SETVAL(c.oid, s.start_value, false) FROM pg_class c
      JOIN pg_namespace pn on c.relnamespace = pn.oid
      JOIN pg_sequences s on s.sequencename = c.relname
    WHERE c.relkind = 'S' AND c.relname != 'migrations_id_seq';
  `);
};

const truncateAll = (trx: EntityManager) => {
  const { factories } = Factory;
  return Promise.all(factories.map((factory) => factory.truncate(trx)));
};

const saveAll = (trx: EntityManager) => {
  const { factories } = Factory;
  const allEntities = factories.flatMap((factory) => factory.getAll());

  return trx.save(allEntities);
};

const run = async () => {
  await dataSource.initialize();

  await dataSource.transaction(async (trx) => {
    await clearSequences(trx);
    await truncateAll(trx);

    seedMockExamQuestionTypes();
    seedDriversLicenseCategories();
    seedOrganizations();
    seedTrainees();
    seedInstructors();
    seedUsers();
    seedVehicles();
    seedDefaultAvailabilities();
    seedAvailabilities();
    seedLessons();
    seedAnnouncements();
    seedPayments();

    await saveAll(trx);
  });

  await dataSource.destroy();
};

run();
