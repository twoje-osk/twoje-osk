import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  CourseReportEntry,
  CourseReportGroup,
  GetCourseReportResponseDto,
} from '@osk/shared';
import { ReportEntriesService } from '../report-entries/report-entries.service';
import { assertNever } from '../utils/assertNever';
import { CourseReportsService } from './course-reports.service';

@Controller('course-reports')
export class CourseReportsController {
  constructor(
    private readonly courseReportsService: CourseReportsService,
    private readonly reportEntriesService: ReportEntriesService,
  ) {}

  @ApiResponse({ type: GetCourseReportResponseDto })
  @Get(':traineeId')
  async getTraineeReport(
    @Param('traineeId', ParseIntPipe) id: number,
  ): Promise<GetCourseReportResponseDto> {
    const traineeReport = await this.courseReportsService.findOneByTraineeId(
      id,
    );

    if (!traineeReport.ok) {
      if (traineeReport.error === 'COURSE_REPORT_NOT_FOUND') {
        throw new NotFoundException(
          'Course report not found for this traineeId',
        );
      }

      return assertNever(traineeReport.error);
    }

    const reportEntryToCourseReportsEntries =
      traineeReport.data.reportEntryToCourseReports.map(
        (reportEntryToCourseReport) =>
          [
            reportEntryToCourseReport.reportEntry.id,
            {
              done: reportEntryToCourseReport.done,
              mastered: reportEntryToCourseReport.mastered,
            },
          ] as const,
      );

    const reportEntryIdToReportEntryToCourseReportsMap = Object.fromEntries(
      reportEntryToCourseReportsEntries,
    );

    const allReportEntries =
      await this.reportEntriesService.getEntriesByReportId(
        traineeReport.data.report.id,
      );

    const mergedEntries = allReportEntries.map((reportEntry) => {
      const traineeAnswers =
        reportEntryIdToReportEntryToCourseReportsMap[reportEntry.id];
      const { reportEntryGroup, ...entry } = reportEntry;
      return {
        ...entry,
        groupDescription: reportEntryGroup.description,
        done: traineeAnswers?.done ?? false,
        mastered: traineeAnswers?.mastered ?? false,
      };
    });

    const groupedEntries = mergedEntries.reduce<
      Record<string, CourseReportEntry[]>
    >((acc, { groupDescription, ...entry }) => {
      const newValue = acc[groupDescription] ?? [];
      newValue.push(entry);

      acc[groupDescription] = newValue;

      return acc;
    }, {});

    const report: CourseReportGroup[] = Object.entries(groupedEntries).map(
      ([groupDescription, entries]) => ({
        groupDescription,
        entries,
      }),
    );

    return {
      courseReportId: traineeReport.data.report.id,
      report,
    };
  }
}
