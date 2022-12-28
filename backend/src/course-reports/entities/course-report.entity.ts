import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReportEntryToCourseReport } from '../../report-entry-to-course-report/entities/report-entry-to-course-report.entity';
import type { Report } from '../../reports/entities/report.entity';
import type { Trainee } from '../../trainees/entities/trainee.entity';

@Entity()
export class CourseReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne<Trainee>('Trainee', (trainee) => trainee.courseReports, {
    nullable: false,
  })
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
