import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseReportsService } from './course-reports.service';
import { CourseReportsController } from './course-reports.controller';
import { CourseReport } from './entities/course-report.entity';
import { TraineesModule } from '../trainees/trainees.module';

@Module({
  exports: [CourseReportsService],
  controllers: [CourseReportsController],
  imports: [TypeOrmModule.forFeature([CourseReport]), TraineesModule],
  providers: [CourseReportsService],
})
export class CourseReportsModule {}
