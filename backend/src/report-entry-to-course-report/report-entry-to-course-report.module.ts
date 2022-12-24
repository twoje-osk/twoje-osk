import { Module } from '@nestjs/common';
import { ReportEntryToCourseReportService } from './report-entry-to-course-report.service';
import { ReportEntryToCourseReportController } from './report-entry-to-course-report.controller';

@Module({
  controllers: [ReportEntryToCourseReportController],
  providers: [ReportEntryToCourseReportService],
})
export class ReportEntryToCourseReportModule {}
