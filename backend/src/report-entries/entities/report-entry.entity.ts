import { MaxLength } from 'class-validator';
import { ReportEntryToCourseReport } from 'report-entry-to-course-report/entities/report-entry-to-course-report.entity';
import { Report } from 'reports/entities/report.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

export class ReportEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(255)
  description: string;

  @ManyToOne<Report>('Report', (report) => report.reportEntries, {
    nullable: false,
  })
  report: Report;

  @OneToMany<ReportEntryToCourseReport>(
    'ReportEntryToCourseReport',
    (reportEntryToCourseReport) => reportEntryToCourseReport.reportEntry,
  )
  reportEntryToCourseReports: ReportEntryToCourseReport[];
}
