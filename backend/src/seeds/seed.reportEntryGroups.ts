import { ReportEntryGroup } from '../report-entries/entities/report-entry-groups.entity';
import { Factory } from './seed.utils';

class ReportEntryGroupFactory extends Factory<ReportEntryGroup> {
  constructor() {
    super(ReportEntryGroup);
  }

  public generate() {
    const reportEntryGroup = new ReportEntryGroup();

    reportEntryGroup.description = this.faker.lorem.sentence(5);

    this.entities.push(reportEntryGroup);
    return reportEntryGroup;
  }
}

export const reportEntryGroupFactory = new ReportEntryGroupFactory();

export const seedReportEntryGroups = () => {
  Array.from({ length: 3 }).forEach(() => reportEntryGroupFactory.generate());
};
