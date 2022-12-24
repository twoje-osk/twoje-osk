import { Controller } from '@nestjs/common';
import { ReportEntryToCourseReportService } from './report-entry-to-course-report.service';

@Controller('report-entry-to-course-report')
export class ReportEntryToCourseReportController {
  constructor(
    private readonly reportEntryToCourseReportService: ReportEntryToCourseReportService,
  ) {}
}
