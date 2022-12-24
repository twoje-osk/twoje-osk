import { Module } from '@nestjs/common';
import { CourseReportsService } from './course-reports.service';
import { CourseReportsController } from './course-reports.controller';

@Module({
  controllers: [CourseReportsController],
  providers: [CourseReportsService],
})
export class CourseReportsModule {}
