import { DriversLicenseCategory } from '../drivers-license-category/entities/drivers-license-category.entity';
import { Factory } from './seed.utils';

class DriversLicenseCategoryFactory extends Factory<DriversLicenseCategory> {
  constructor() {
    super(DriversLicenseCategory);
  }

  public generate() {
    const category = new DriversLicenseCategory();
    category.name = this.faker.word.noun();
    category.reports = [];

    this.entities.push(category);
    return category;
  }
}
export const driversLicenseCategoriesFactory =
  new DriversLicenseCategoryFactory();

export const seedDriversLicenseCategories = () => [
  driversLicenseCategoriesFactory.generateFromData({
    id: 1,
    name: 'AM',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 2,
    name: 'A1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 3,
    name: 'A2',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 4,
    name: 'A',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 5,
    name: 'B1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 6,
    name: 'B',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 7,
    name: 'B+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 8,
    name: 'C1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 9,
    name: 'C1+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 10,
    name: 'C',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 11,
    name: 'C+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 12,
    name: 'D1',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 13,
    name: 'D1+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 14,
    name: 'D',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 15,
    name: 'D+E',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 16,
    name: 'T',
  }),
  driversLicenseCategoriesFactory.generateFromData({
    id: 17,
    name: 'Tramwaj',
  }),
];
