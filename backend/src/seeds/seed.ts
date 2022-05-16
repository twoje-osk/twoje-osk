import { EntityManager } from 'typeorm';
import { Trainee } from '../trainees/entities/trainee.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { dataSource } from '../data-source';
import { getSeedUsers } from './seed.user';
import { getSeedOrganizations } from './seed.organization';
import { getSeedTrainees } from './seed.trainees';

const clear = async (trx: EntityManager) => {
  const usersRepository = trx.getRepository(User);
  const organizationsRepository = trx.getRepository(Organization);
  const traineeRepository = trx.getRepository(Trainee);

  const repositories = [
    usersRepository,
    organizationsRepository,
    traineeRepository,
  ];
  await Promise.all(
    repositories.map((repository) =>
      trx.query(`TRUNCATE "${repository.metadata.tableName}" CASCADE`),
    ),
  );

  const sequences = ['user_id_seq', 'trainee_id_seq', 'organization_id_seq'];
  await Promise.all(
    sequences.map((sequence) =>
      trx.query(`ALTER SEQUENCE "${sequence}" RESTART WITH 1`),
    ),
  );
};

const run = async () => {
  await dataSource.initialize();

  await dataSource.transaction(async (trx) => {
    await clear(trx);

    const organizations = getSeedOrganizations();
    const users = getSeedUsers(organizations);
    const trainees = getSeedTrainees(users);

    await trx.save([...organizations, ...trainees, ...users]);
  });

  await dataSource.destroy();
};

run();
