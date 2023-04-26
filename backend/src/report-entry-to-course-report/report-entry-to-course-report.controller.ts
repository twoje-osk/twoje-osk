import { Body, Controller, NotFoundException, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ReportEntryToCourseReportCreateOrUpdateRequestDto } from '@osk/shared';
import { assertNever } from '../utils/assertNever';
import { ReportEntryToCourseReportService } from './report-entry-to-course-report.service';

export interface ReportEntryType {
  reportEntryId: number;
  courseReportId: number;
  done: boolean;
  mastered: boolean;
}

@Controller('report-entry-to-course-report')
export class ReportEntryToCourseReportController {
  constructor(
    private readonly reportEntryToCourseReportService: ReportEntryToCourseReportService,
  ) {}

  // @ApiResponse({ type: '' })
  // @Put()
  // async createOrModify(
  //   @Body()
  //   {
  //     reportEntryToCourseReport,
  //   }: ReportEntryToCourseReportCreateOrModifyRequestDto,
  // ): Promise<ReportEntryToCourseReportCreateOrModifyResponseDto>;

  @ApiResponse({
    type: '',
    description: 'Create or update entries for course reports',
  })
  @Put()
  async createOrModify(
    @Body()
    reportEntryToCourseReport: ReportEntryToCourseReportCreateOrUpdateRequestDto,
  ): Promise<any> {
    const result =
      await this.reportEntryToCourseReportService.setEntryForCourseReport(
        reportEntryToCourseReport.reportEntryId,
        reportEntryToCourseReport.courseReportId,
        reportEntryToCourseReport.done,
        reportEntryToCourseReport.mastered,
      );

    if (!result.ok) {
      if (result.error === 'COURSE_REPORT_NOT_FOUND') {
        throw new NotFoundException(
          "Course report with specified id doesn't exist",
        );
      }

      return assertNever(result.error);
    }

    return {};
  }
}
