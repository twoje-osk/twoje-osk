import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReportEntryToCourseReport } from '../../report-entry-to-course-report/entities/report-entry-to-course-report.entity';
import type { Report } from '../../reports/entities/report.entity';
import type { Trainee } from '../../trainees/entities/trainee.entity';

@Entity()
export class CourseReport {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne<Trainee>('Trainee', (trainee) => trainee.courseReport, {
    nullable: false,
  })
  @JoinColumn()
  trainee: Trainee;

  @ManyToOne<Report>('Report', (report) => report.courseReports, {
    nullable: false,
  })
  report: Report;

  @OneToMany<ReportEntryToCourseReport>(
    'ReportEntryToCourseReport',
    (reportEntryToCourseReport) => reportEntryToCourseReport.courseReport,
  )
  reportEntryToCourseReports: ReportEntryToCourseReport[];
}
