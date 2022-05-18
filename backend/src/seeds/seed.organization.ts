import { Organization } from '../organizations/entities/organization.entity';
import { Factory } from './seed.utils';

class OrganizationsFactory extends Factory<Organization> {
  constructor() {
    super('Organizations');
  }

  public generate() {
    const organization = new Organization();
    organization.name = this.faker.company.companyName();

    this.entities.push(organization);
    return organization;
  }
}

export const organizationsFactory = new OrganizationsFactory();

export const seedOrganizations = () => {
  organizationsFactory.generateFromData({
    name: 'Test OSK',
  });
  organizationsFactory.generateFromData({
    name: 'Other Test OSK',
  });
};
