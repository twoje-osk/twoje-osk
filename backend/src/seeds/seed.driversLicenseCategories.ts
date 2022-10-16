import { DriversLicenseCategory } from '../driversLicenseCategory/entities/driversLicenseCategory.entity';
import { Factory } from './seed.utils';

class DriversLicenseCategoryFactory extends Factory<DriversLicenseCategory> {
  constructor() {
    super(DriversLicenseCategory);
  }

  public generate() {
    const category = new DriversLicenseCategory();
    category.name = this.faker.word.noun();
    this.entities.push(category);
    return category;
  }
}
export const driversLicenseCategoriesFactory =
  new DriversLicenseCategoryFactory();

export const seedDriversLicenseCategories = () => [
  driversLicenseCategoriesFactory.generateFromData({
    name: 'AM',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'A1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'A2',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'A',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'B1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'B',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'B+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'C1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'C1+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'C',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'C+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'D1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'D1+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'D',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'D+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'T',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    name: 'Tramwaj',
  }),
];
