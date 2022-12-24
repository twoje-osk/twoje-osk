import { CourseReport } from 'course-reports/entities/course-report.entity';
import { ReportEntry } from 'report-entries/entities/report-entry.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export class ReportEntryToCourseReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  done: boolean;

  @Column({ default: false })
  mastered: boolean;

  @ManyToOne<CourseReport>(
    'CourseReport',
    (courseReport) => courseReport.reportEntryToCourseReports,
    {
      nullable: false,
    },
  )
  courseReport: CourseReport;

  @ManyToOne<ReportEntry>(
    'ReportEntry',
    (reportEntry) => reportEntry.reportEntryToCourseReports,
    {
      nullable: false,
    },
  )
  reportEntry: ReportEntry;
}
