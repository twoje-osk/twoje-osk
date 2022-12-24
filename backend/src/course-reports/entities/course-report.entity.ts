import { ReportEntryToCourseReport } from 'report-entry-to-course-report/entities/report-entry-to-course-report.entity';
import { Report } from 'reports/entities/report.entity';
import { Trainee } from 'trainees/entities/trainee.entity';
import { OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';

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
