import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
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

  @Transactional()
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

    console.debug('CONTENT REPORT:', report);

    if (report === null) {
      return getFailure('REPORT_NOT_FOUND_FROM_TRAINEE');
    }

    const existAlready = await this.findOneByTraineeId(trainee.id);

    console.debug('CONTENT existAlready:', existAlready);

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

  // async create(traineeId: number) {
  //   const { id: organizationId } =
  //     this.organizationDomainService.getRequestOrganization();

  //   const trainee = await this.traineesRepository.findOne({
  //     where: {
  //       id: traineeId,
  //       user: {
  //         organizationId,
  //       },
  //     },
  //   });

  //   const courseReport = await this.courseReportsRepository.create({
  //     trainee,
  //   });
  // }
}
