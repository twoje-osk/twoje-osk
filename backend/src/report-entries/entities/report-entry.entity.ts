import { MaxLength } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Entity,
} from 'typeorm';
import { ReportEntryGroup } from './report-entry-groups.entity';
import type { ReportEntryToCourseReport } from '../../report-entry-to-course-report/entities/report-entry-to-course-report.entity';
import type { Report } from '../../reports/entities/report.entity';

@Entity()
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

  @ManyToOne<ReportEntryGroup>('ReportEntryGroup')
  reportEntryGroup: ReportEntryGroup;
}
