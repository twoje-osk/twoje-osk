import { Body, Controller, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ReportEntryToCourseReportCreateOrUpdateRequestDto } from '@osk/shared';
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
    await this.reportEntryToCourseReportService.setEntryForCourseReport(
      reportEntryToCourseReport.reportEntryId,
      reportEntryToCourseReport.courseReportId,
      reportEntryToCourseReport.done,
      reportEntryToCourseReport.mastered,
    );

    return {};
  }
}
