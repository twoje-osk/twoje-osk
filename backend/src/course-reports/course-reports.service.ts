import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntriesService } from '../report-entries/report-entries.service';
import { CourseReport } from './entities/course-report.entity';

@Injectable()
export class CourseReportsService {
  constructor(
    @InjectRepository(CourseReport)
    private courseReportsRepository: Repository<CourseReport>,
    private reportEntriesService: ReportEntriesService,
  ) {}

  async getCourseReportsByTrainee(traineeId: number) {
    const reports = await this.courseReportsRepository.findOne({
      where: {
        trainee: { id: traineeId },
      },
      relations: {
        report: { driversLicenseCategory: true },
        reportEntryToCourseReports: { reportEntry: true },
      },
    });

    return reports;
  }

  // async generateCourseReport(mockReportId: number) {
  //   const reportEntries = await this.
  //   const report = await this.courseReportsRepository.create();
  // }
}
