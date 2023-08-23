import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { ReportsService } from '../reports/reports.service';
import { getFailure, getSuccess, Try } from '../types/Try';
import { CourseReport } from './entities/course-report.entity';

@Injectable()
export class CourseReportsService {
  constructor(
    @InjectRepository(CourseReport)
    private courseReportsRepository: Repository<CourseReport>,
    private organizationDomainService: OrganizationDomainService,
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
    driversLicenseCategoryId: number,
  ): Promise<
    Try<
      number,
      | 'REPORT_NOT_FOUND_FOR_SPECIFIED_LICENSE_CATEGORY_ID'
      | 'REPORT_ALREADY_CREATED_FOR_TRAINEE'
    >
  > {
    const report = await this.reportsService.findOneByDriversLicenseCategoryId(
      driversLicenseCategoryId,
    );

    if (report === null) {
      return getFailure('REPORT_NOT_FOUND_FOR_SPECIFIED_LICENSE_CATEGORY_ID');
    }

    const reportForCurrentUser = await this.findOneByTraineeId(traineeId);
    if (reportForCurrentUser.ok) {
      return getFailure('REPORT_ALREADY_CREATED_FOR_TRAINEE');
    }

    const newTraineeReport = this.courseReportsRepository.create({
      trainee: {
        id: traineeId,
      },
      report,
      reportEntryToCourseReports: [],
    });

    await this.courseReportsRepository.save(newTraineeReport);

    return getSuccess(newTraineeReport.id);
  }
}
