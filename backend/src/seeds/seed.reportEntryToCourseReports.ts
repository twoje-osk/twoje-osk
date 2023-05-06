import { ReportEntryToCourseReport } from '../report-entry-to-course-report/entities/report-entry-to-course-report.entity';
import { courseReportFactory } from './seed.courseReports';
import { reportEntryFactory } from './seed.reportEntries';
import { Factory } from './seed.utils';

class ReportEntryToCourseReportFactory extends Factory<ReportEntryToCourseReport> {
  constructor() {
    super(ReportEntryToCourseReport);
  }

  public generate() {
    const reportEntryToCourseReport = new ReportEntryToCourseReport();

    reportEntryToCourseReport.courseReport = courseReportFactory.getAll()[0]!;
    reportEntryToCourseReport.reportEntry = this.faker.helpers.arrayElement(
      reportEntryFactory.getAll(),
    );

    reportEntryToCourseReport.done = this.faker.datatype.boolean();
    if (reportEntryToCourseReport.done) {
      reportEntryToCourseReport.mastered = this.faker.datatype.boolean();
    }

    this.entities.push(reportEntryToCourseReport);
    return reportEntryToCourseReport;
  }
}

export const reportEntryToCourseReportFactory =
  new ReportEntryToCourseReportFactory();

export const seedReportEntryToCourseReport = () => {
  return [
    reportEntryToCourseReportFactory.generateFromData({
      courseReport: courseReportFactory.getAll()[0]!,
      reportEntry: reportEntryFactory.getAll()[0]!,
    }),
    reportEntryToCourseReportFactory.generateFromData({
      courseReport: courseReportFactory.getAll()[0]!,
      reportEntry: reportEntryFactory.getAll()[1]!,
    }),
    reportEntryToCourseReportFactory.generateFromData({
      courseReport: courseReportFactory.getAll()[0]!,
      reportEntry: reportEntryFactory.getAll()[2]!,
    }),
    reportEntryToCourseReportFactory.generateFromData({
      courseReport: courseReportFactory.getAll()[0]!,
      reportEntry: reportEntryFactory.getAll()[3]!,
    }),
    reportEntryToCourseReportFactory.generateFromData({
      courseReport: courseReportFactory.getAll()[0]!,
      reportEntry: reportEntryFactory.getAll()[4]!,
    }),
  ];
};
