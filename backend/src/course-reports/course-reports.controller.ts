import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ReportEntriesService } from '../report-entries/report-entries.service';
import { assertNever } from '../utils/assertNever';
import { CourseReportsService } from './course-reports.service';

@Controller('course-reports')
export class CourseReportsController {
  constructor(
    private readonly courseReportsService: CourseReportsService,
    private readonly reportEntriesService: ReportEntriesService,
  ) {}

  @ApiResponse({ type: '' })
  @Get(':traineeId')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getTraineeReport(@Param('traineeId', ParseIntPipe) id: number) {
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

    const entries = traineeReport.data.reportEntryToCourseReports.map(
      (reportEntryToCourseReport) =>
        [
          reportEntryToCourseReport.reportEntry.id,
          {
            done: reportEntryToCourseReport.done,
            mastered: reportEntryToCourseReport.mastered,
          },
        ] as const,
    );

    const reportEntryIdToReportEntryToCourseReportsMap =
      Object.fromEntries(entries);

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

    type MergedEntry = typeof mergedEntries[number];

    const groupedEntries = mergedEntries.reduce<
      Record<string, Omit<MergedEntry, 'groupDescription'>[]>
    >((acc, { groupDescription, ...entry }) => {
      const newValue = acc[groupDescription] ?? [];
      newValue.push(entry);

      acc[groupDescription] = newValue;

      return acc;
    }, {});

    return {
      courseReportId: traineeReport.data.report.id,
      report: [groupedEntries],
    };
  }
}
