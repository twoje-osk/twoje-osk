import { runSeeds } from './seed.setup';

import { seedMockExam } from './seed.mockExam';
import { seedDriversLicenseCategories } from './seed.driversLicenseCategories';

runSeeds(async () => {
  seedDriversLicenseCategories();
  await seedMockExam({ useProductionData: true });
});
