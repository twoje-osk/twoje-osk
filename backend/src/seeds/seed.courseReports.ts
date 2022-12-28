import { CourseReport } from '../course-reports/entities/course-report.entity';
import { reportFactory } from './seed.reports';
import { traineesFactory } from './seed.trainees';
import { Factory } from './seed.utils';

class CourseReportFactory extends Factory<CourseReport> {
  constructor() {
    super(CourseReport);
  }

  public generate() {
    const courseReport = new CourseReport();

    courseReport.report = reportFactory.getAll()[0]!;

    courseReport.trainee = traineesFactory.getAll()[0]!;

    this.entities.push(courseReport);
    return courseReport;
  }
}

export const courseReportFactory = new CourseReportFactory();

export const seedCourseReports = () => {
  Array.from({ length: 1 }).forEach(() => courseReportFactory.generate());
};
