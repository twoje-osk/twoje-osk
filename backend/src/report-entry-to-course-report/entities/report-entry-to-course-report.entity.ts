import { Exclude } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  RelationId,
  Unique,
} from 'typeorm';
import type { CourseReport } from '../../course-reports/entities/course-report.entity';
import { ReportEntry } from '../../report-entries/entities/report-entry.entity';

@Entity()
@Unique('courseReportToReportEntry', ['courseReport', 'reportEntry'])
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

  @Exclude()
  @Column()
  @RelationId(
    (reportEntryToCourseReports: ReportEntryToCourseReport) =>
      reportEntryToCourseReports.courseReport,
  )
  courseReportId: number;

  @ManyToOne<ReportEntry>(
    'ReportEntry',
    (reportEntry) => reportEntry.reportEntryToCourseReports,
    {
      nullable: false,
    },
  )
  reportEntry: ReportEntry;

  @Exclude()
  @Column()
  @RelationId(
    (reportEntryToCourseReports: ReportEntryToCourseReport) =>
      reportEntryToCourseReports.reportEntry,
  )
  reportEntryId: number;
}
