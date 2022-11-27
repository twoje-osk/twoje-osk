import { EntityManager } from 'typeorm';
import { dataSource } from '../data-source';
import { Factory } from './seed.utils';

const truncateAll = (trx: EntityManager) => {
  const { factories } = Factory;

  return Promise.all(factories.map((factory) => factory.truncate(trx)));
};

const saveAll = (trx: EntityManager) => {
  const { factories } = Factory;
  const allEntities = factories.flatMap((factory) => factory.getAll());

  return trx.save(allEntities);
};

export const runSeeds = async (cb: () => Promise<void>) => {
  await dataSource.initialize();

  await dataSource.transaction(async (trx) => {
    await truncateAll(trx);

    await cb();

    await saveAll(trx);
  });

  await dataSource.destroy();
};
