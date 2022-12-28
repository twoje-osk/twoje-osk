import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TraineesService } from '../trainees/trainees.service';
import { CourseReport } from './entities/course-report.entity';

@Injectable()
export class CourseReportsService {
  constructor(
    @InjectRepository(CourseReport)
    private courseReportsRepository: Repository<CourseReport>,
    private traineesService: TraineesService,
  ) {}

  async getCourseReportsByTrainee(traineeId: number) {
    const reports = await this.courseReportsRepository.find({
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
}
