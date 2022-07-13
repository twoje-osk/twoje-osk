import { EntityManager, Repository } from 'typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Availability } from '../availability/entities/availability.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Trainee } from '../trainees/entities/trainee.entity';
import { User } from '../users/entities/user.entity';
import { instructorsFactory } from './seed.instructors';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { organizationsFactory } from './seed.organization';
import { traineesFactory } from './seed.trainees';
import { usersFactory } from './seed.user';
import { vehiclesFactory } from './seed.vehicles';
import { Factory } from './seed.utils';
import { availabilitiesFactory } from './seed.availabilities';
import { lessonsFactory } from './seed.lessons';

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
    factory: instructorsFactory,
    repository: trx.getRepository(Instructor),
    sequences: ['instructor_id_seq'],
  },
  {
    factory: usersFactory,
    repository: trx.getRepository(User),
    sequences: ['user_id_seq'],
  },
  {
    factory: vehiclesFactory,
    repository: trx.getRepository(Vehicle),
    sequences: ['vehicle_id_seq'],
  },
  {
    factory: availabilitiesFactory,
    repository: trx.getRepository(Availability),
    sequences: ['availability_id_seq'],
  },
  {
    factory: lessonsFactory,
    repository: trx.getRepository(Lesson),
    sequences: ['lesson_id_seq'],
  },
];