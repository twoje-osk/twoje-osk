import { Report } from '../reports/entities/report.entity';
import { driversLicenseCategoriesFactory } from './seed.driversLicenseCategories';
import { Factory } from './seed.utils';

class ReportFactory extends Factory<Report> {
  constructor() {
    super(Report);
  }

  public generate() {
    const report = new Report();

    report.driversLicenseCategory = driversLicenseCategoriesFactory
      .getAll()
      .find((category) => category.name === 'B')!;

    report.createdAt = new Date();

    this.entities.push(report);
    return report;
  }
}

export const reportFactory = new ReportFactory();

export const seedReports = () => {
  Array.from({ length: 1 }).forEach(() => reportFactory.generate());
};
