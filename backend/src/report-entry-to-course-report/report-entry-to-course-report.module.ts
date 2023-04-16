import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntryToCourseReportService } from './report-entry-to-course-report.service';
import { ReportEntryToCourseReportController } from './report-entry-to-course-report.controller';
import { ReportEntryToCourseReport } from './entities/report-entry-to-course-report.entity';
import { CourseReportsModule } from '../course-reports/course-reports.module';

@Module({
  exports: [ReportEntryToCourseReportService],
  controllers: [ReportEntryToCourseReportController],
  imports: [
    TypeOrmModule.forFeature([ReportEntryToCourseReport]),
    CourseReportsModule,
  ],
  providers: [ReportEntryToCourseReportService],
})
export class ReportEntryToCourseReportModule {}
