import { GetCourseReportResponseDto } from '@osk/shared';
import { ReportGroup, RowData } from './Report';

export const mapCourseReportDtoToReportGroups = (
  reportData: GetCourseReportResponseDto,
) =>
  reportData.report.map(
    (group): ReportGroup => ({
      description: group.groupDescription,
      rows: group.entries.map(
        (entry): RowData => ({
          id: entry.id,
          action: entry.description,
          done: entry.done,
          mastered: entry.mastered,
        }),
      ),
    }),
  );
