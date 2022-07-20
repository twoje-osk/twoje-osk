import { EntityManager } from 'typeorm';
import { dataSource } from '../data-source';
import { seedUsers } from './seed.user';
import { seedOrganizations } from './seed.organization';
import { seedTrainees } from './seed.trainees';
import { seedVehicles } from './seed.vehicles';
import { seedInstructors } from './seed.instructors';
import { seedAvailabilities } from './seed.availabilities';
import { seedLessons } from './seed.lessons';
import { Factory } from './seed.utils';

const clearSequences = async (trx: EntityManager) => {
  await trx.query(`
    SELECT SETVAL(c.oid, s.start_value, false) FROM pg_class c
      JOIN pg_namespace pn on c.relnamespace = pn.oid
      JOIN pg_sequences s on s.sequencename = c.relname
    WHERE c.relkind = 'S';
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

    seedOrganizations();
    seedTrainees();
    seedInstructors();
    seedUsers();
    seedVehicles();
    seedAvailabilities();
    seedLessons();

    await saveAll(trx);
  });

  await dataSource.destroy();
};

run();
