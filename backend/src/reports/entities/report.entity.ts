import { CourseReport } from 'course-reports/entities/course-report.entity';
import { DriversLicenseCategory } from 'drivers-license-category/entities/drivers-license-category.entity';
import { ReportEntry } from 'report-entries/entities/report-entry.entity';
import { ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne<DriversLicenseCategory>(
    'DriversLicenseCategory',
    (driversLicenseCategory) => driversLicenseCategory.reports,
    {
      nullable: false,
    },
  )
  driversLicenseCategory: DriversLicenseCategory;

  @OneToMany<ReportEntry>('ReportEntry', (reportEntry) => reportEntry.report)
  reportEntries: ReportEntry[];

  @OneToMany<CourseReport>(
    'CourseReports',
    (courseReport) => courseReport.report,
  )
  courseReports: CourseReport[];
}
