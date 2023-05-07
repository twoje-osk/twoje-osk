import { ReportEntry } from '../report-entries/entities/report-entry.entity';
import { reportEntryGroupFactory } from './seed.reportEntryGroups';
import { reportFactory } from './seed.reports';
import { Factory } from './seed.utils';

class ReportEntryFactory extends Factory<ReportEntry> {
  constructor() {
    super(ReportEntry);
  }

  public generate() {
    const reportEntry = new ReportEntry();

    reportEntry.report = reportFactory.getAll()[0]!;
    reportEntry.description = this.faker.lorem.sentence();
    reportEntry.reportEntryGroup = this.faker.helpers.arrayElement(
      reportEntryGroupFactory.getAll(),
    );

    this.entities.push(reportEntry);
    return reportEntry;
  }
}

export const reportEntryFactory = new ReportEntryFactory();

export const seedReportEntries = () => {
  Array.from({ length: 5 }).forEach(() => reportEntryFactory.generate());
};
