import 'dotenv/config';
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
import { seedReports } from './seed.reports';
import { seedCourseReports } from './seed.courseReports';
import { seedReportEntries } from './seed.reportEntries';
import { seedReportEntryToCourseReport } from './seed.reportEntryToCourseReports';
import { seedReportEntryGroups } from './seed.reportEntryGroups';
import { seedLectures } from './seed.lecture';

runSeeds(async () => {
  const useProductionData = process.env.USE_EXAM_PRODUCTION_DATA === 'true';

  seedDriversLicenseCategories();
  await seedMockExam({ useProductionData });

  seedReports();
  seedReportEntryGroups();
  seedReportEntries();

  seedOrganizations();
  seedTrainees();
  seedInstructors();
  await seedUsers();

  seedCourseReports();
  seedReportEntryToCourseReport();

  seedVehicles();
  seedDefaultAvailabilities();
  seedAvailabilities();
  seedLessons();
  seedAnnouncements();
  seedPayments();
  seedLectures();
});
