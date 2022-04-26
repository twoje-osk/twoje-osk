import faker from '@faker-js/faker';
import { Organization } from '../organizations/entities/organization.entity';
import { getSeedFromString } from './seed.utils';

export const getSeedOrganizations = () => {
  faker.seed(getSeedFromString('Organizations'));

  const organization1 = new Organization();
  organization1.name = 'Test OSK';

  const organization2 = new Organization();
  organization2.name = 'Other Test OSK';

  const organizations = [organization1, organization2];

  return organizations;
};
