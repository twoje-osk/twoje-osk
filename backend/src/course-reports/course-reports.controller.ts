import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CourseReportsService } from './course-reports.service';

@Controller('course-reports')
export class CourseReportsController {
  constructor(private readonly courseReportsService: CourseReportsService) {}

  @ApiResponse({ type: '' })
  @Get(':id')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getTraineeReport(@Param('id', ParseIntPipe) id: number) {
    const traineeReport = await this.courseReportsService.findOneByTraineeId(
      id,
    );
    return { traineeReport };
  }

  @ApiResponse({ type: '' })
  @Post(':traineeId')
  async addTraineeReport(
    @Param('traineeId', ParseIntPipe) traineeId: number,
  ): Promise<{}> {
    const newCourseReport = await this.courseReportsService.create(traineeId);

    if (newCourseReport.ok === true) {
      return { newCourseReport };
    }
    if (newCourseReport.error === 'TRAINEE_DOES_NOT_EXIST') {
      throw new NotFoundException('Trainee with this ID does not exist');
    }
    if (newCourseReport.error === 'REPORT_NOT_FOUND_FROM_TRAINEE') {
      throw new NotFoundException('Trainee found with a non existant report');
    }
    if (newCourseReport.error === 'REPORT_ALREADY_CREATED_FOR_TRAINEE') {
      throw new NotFoundException(
        'This Trainee already have the latest report version',
      );
    }
    return { newCourseReport };
  }
}
