import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { ReportsService } from '../reports/reports.service';
import { TraineesService } from '../trainees/trainees.service';
import { getFailure, getSuccess, Try } from '../types/Try';
import { CourseReport } from './entities/course-report.entity';

@Injectable()
export class CourseReportsService {
  constructor(
    @InjectRepository(CourseReport)
    private courseReportsRepository: Repository<CourseReport>,
    private organizationDomainService: OrganizationDomainService,
    private traineesService: TraineesService,
    private reportsService: ReportsService,
  ) {}

  async findOneByTraineeId(
    traineeId: number,
  ): Promise<Try<CourseReport, 'COURSE_REPORT_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const report = await this.courseReportsRepository.findOne({
      where: {
        trainee: {
          id: traineeId,
          user: {
            organizationId,
          },
        },
      },
      relations: {
        report: { driversLicenseCategory: true },
        reportEntryToCourseReports: { reportEntry: true },
      },
    });

    if (report === null) {
      return getFailure('COURSE_REPORT_NOT_FOUND');
    }

    return getSuccess(report);
  }

  async findOneByCourseReportId(
    courseReportId: number,
  ): Promise<Try<CourseReport, 'COURSE_REPORT_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const report = await this.courseReportsRepository.findOne({
      where: {
        id: courseReportId,
        trainee: { user: { organizationId } },
      },
      relations: {
        report: { driversLicenseCategory: true },
        reportEntryToCourseReports: { reportEntry: true },
        trainee: {
          user: true,
        },
      },
    });

    if (report === null) {
      return getFailure('COURSE_REPORT_NOT_FOUND');
    }

    return getSuccess(report);
  }

  @TransactionalWithTry()
  async create(
    traineeId: number,
  ): Promise<
    Try<
      number,
      | 'TRAINEE_DOES_NOT_EXIST'
      | 'REPORT_NOT_FOUND_FROM_TRAINEE'
      | 'REPORT_ALREADY_CREATED_FOR_TRAINEE'
    >
  > {
    const trainee = await this.traineesService.findOneById(traineeId);

    if (trainee === null) {
      return getFailure('TRAINEE_DOES_NOT_EXIST');
    }

    const report = await this.reportsService.findOneByDriversLicenseCategoryId(
      trainee.driversLicenseCategoryId,
    );

    if (report === null) {
      return getFailure('REPORT_NOT_FOUND_FROM_TRAINEE');
    }

    const existAlready = await this.findOneByTraineeId(trainee.id);

    if (existAlready !== null) {
      return getFailure('REPORT_ALREADY_CREATED_FOR_TRAINEE');
    }

    const newTraineeReport = await this.courseReportsRepository.create({
      trainee,
      report,
      reportEntryToCourseReports: [],
    });

    await this.courseReportsRepository.save(newTraineeReport);

    return getSuccess(newTraineeReport.id);
  }
}
