import { runSeeds } from './seed.setup';

import { seedUsers } from './seed.user';
import { seedOrganizations } from './seed.organization';
import { seedTrainees } from './seed.trainees';
import { seedVehicles } from './seed.vehicles';
import { seedInstructors } from './seed.instructors';
import { seedAvailabilities } from './seed.availabilities';
import { seedLessons } from './seed.lessons';
import { seedPayments } from './seed.payments';
import { seedAnnouncements } from './seed.announcement';
import { seedDefaultAvailabilities } from './seed.defaultAvailabilities';
import { seedMockExam } from './seed.mockExam';
import { seedDriversLicenseCategories } from './seed.driversLicenseCategories';

runSeeds(async () => {
  seedDriversLicenseCategories();
  await seedMockExam({ useProductionData: false });
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
});
