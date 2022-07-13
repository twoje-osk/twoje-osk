import { EntityManager } from 'typeorm';
import { dataSource } from '../data-source';
import { seedUsers } from './seed.user';
import { seedOrganizations } from './seed.organization';
import { seedTrainees } from './seed.trainees';
import { seedVehicles } from './seed.vehicles';
import { seedInstructors } from './seed.instructors';
import { Factory } from './seed.utils';

const clearSequences = async (trx: EntityManager) => {
  await trx.query(`
    SELECT SETVAL(c.oid, s.start_value) FROM pg_class c
      JOIN pg_namespace pn on c.relnamespace = pn.oid
      JOIN pg_sequences s on s.sequencename = c.relname
    WHERE c.relkind = 'S';
  `);
};

const run = async () => {
  await dataSource.initialize();

  await dataSource.transaction(async (trx) => {
    await clearSequences(trx);

    seedOrganizations();
    seedTrainees();
    seedInstructors();
    seedUsers();
    seedVehicles();
    seedAvailabilities();
    seedLessons();

    const { factories } = Factory;
    await Promise.all(factories.map((factory) => factory.truncate(trx)));

    for (const factory of factories) {
      // eslint-disable-next-line no-await-in-loop
      await factory.save(trx);
    }
  });

  await dataSource.destroy();
};

run();
