import { EntityManager, Repository } from 'typeorm';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Trainee } from '../trainees/entities/trainee.entity';
import { User } from '../users/entities/user.entity';
import { instructorsFactory } from './seed.instructors';
import { organizationsFactory } from './seed.organization';
import { traineesFactory } from './seed.trainees';
import { usersFactory } from './seed.user';
import { Factory } from './seed.utils';

export interface EntityDbData {
  factory: Factory<any>;
  repository: Repository<any>;
  sequences: string[];
}

export const getEntitiesDbData = (trx: EntityManager): EntityDbData[] => [
  {
    factory: organizationsFactory,
    repository: trx.getRepository(Organization),
    sequences: ['organization_id_seq'],
  },
  {
    factory: traineesFactory,
    repository: trx.getRepository(Trainee),
    sequences: ['trainee_id_seq'],
  },
  {
    factory: usersFactory,
    repository: trx.getRepository(User),
    sequences: ['user_id_seq'],
  },
  {
    factory: instructorsFactory,
    repository: trx.getRepository(Instructor),
    sequences: ['instructor_id_seq'],
  },
];
