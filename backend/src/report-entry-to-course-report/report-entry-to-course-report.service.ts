import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationDomainService } from '../organization-domain/organization-domain.service';
import { getFailure, getSuccess, Try } from '../types/Try';
import { ReportEntryToCourseReport } from './entities/report-entry-to-course-report.entity';
import { CourseReportsService } from '../course-reports/course-reports.service';

@Injectable()
export class ReportEntryToCourseReportService {
  constructor(
    @InjectRepository(ReportEntryToCourseReport)
    private reportEntryToCourseReportsRepository: Repository<ReportEntryToCourseReport>,
    private organizationDomainService: OrganizationDomainService,
    private courseReportsService: CourseReportsService,
  ) {}

  async findOneById(
    entryId: number,
  ): Promise<Try<ReportEntryToCourseReport, 'ENTRY_NOT_FOUND'>> {
    const { id: organizationId } =
      this.organizationDomainService.getRequestOrganization();

    const entry = await this.reportEntryToCourseReportsRepository.findOne({
      where: {
        id: entryId,
        courseReport: {
          trainee: {
            user: {
              organizationId,
            },
          },
        },
      },
    });

    if (entry === null) {
      return getFailure('ENTRY_NOT_FOUND');
    }

    return getSuccess(entry);
  }

  async findOneByEntryCourse(
    reportEntryId: number,
    courseReportId: number,
  ): Promise<Try<ReportEntryToCourseReport, 'RECORD_NOT_FOUND'>> {
    const record = await this.reportEntryToCourseReportsRepository.findOne({
      where: {
        courseReport: { id: courseReportId },
        reportEntry: { id: reportEntryId },
      },
    });

    if (record === null) {
      return getFailure('RECORD_NOT_FOUND');
    }

    return getSuccess(record);
  }

  async setEntryForCourseReport(
    reportEntryId: number,
    courseReportId: number,
    done: boolean,
    mastered: boolean,
  ): Promise<Try<undefined, 'COURSE_REPORT_NOT_FOUND'>> {
    const courseReportExists =
      await this.courseReportsService.findOneByCourseReportId(courseReportId);

    if (!courseReportExists.ok) {
      return getFailure(courseReportExists.error);
    }

    const checkExistingEntry = await this.findOneByEntryCourse(
      reportEntryId,
      courseReportId,
    );

    if (!checkExistingEntry.ok) {
      await this.reportEntryToCourseReportsRepository.insert({
        reportEntryId,
        courseReportId,
        done,
        mastered,
      });

      return getSuccess(undefined);
    }

    if (
      checkExistingEntry.data.done !== done ||
      checkExistingEntry.data.mastered !== mastered
    ) {
      await this.reportEntryToCourseReportsRepository.update(
        { id: checkExistingEntry.data.id },
        { done, mastered },
      );
    }

    return getSuccess(undefined);
  }
}
