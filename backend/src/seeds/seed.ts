import { EntityManager } from 'typeorm';
import { dataSource } from '../data-source';
import { seedUsers } from './seed.user';
import { seedOrganizations } from './seed.organization';
import { seedTrainees } from './seed.trainees';
import { EntityDbData, getEntitiesDbData } from './seed.entities';

const clear = async (trx: EntityManager, entitiesDbData: EntityDbData[]) => {
  await Promise.all(
    entitiesDbData.map(({ repository }) =>
      trx.query(`TRUNCATE "${repository.metadata.tableName}" CASCADE`),
    ),
  );

  await Promise.all(
    entitiesDbData.flatMap(({ sequences }) =>
      sequences.map((sequence) =>
        trx.query(`ALTER SEQUENCE "${sequence}" RESTART WITH 1`),
      ),
    ),
  );
};

const run = async () => {
  await dataSource.initialize();

  await dataSource.transaction(async (trx) => {
    const entitiesDbData = getEntitiesDbData(trx);
    await clear(trx, entitiesDbData);

    seedOrganizations();
    seedTrainees();
    seedUsers();

    await Promise.all(entitiesDbData.map(({ factory }) => factory.save(trx)));
  });

  await dataSource.destroy();
};

run();
