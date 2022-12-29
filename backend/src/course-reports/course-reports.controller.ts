import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CourseReportsService } from './course-reports.service';

@Controller('course-reports')
export class CourseReportsController {
  constructor(private readonly courseReportsService: CourseReportsService) {}

  @ApiResponse({ type: '' })
  @Get(':id')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getTraineeReport(@Param('id', ParseIntPipe) id: number) {
    const traineeReport =
      await this.courseReportsService.getCourseReportsByTrainee(id);
    return { traineeReport };
  }
}
